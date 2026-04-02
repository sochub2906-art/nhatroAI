import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getAccessToken(serviceAccount: any) {
  const jwt = await new jose.SignJWT({
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: "https://oauth2.googleapis.com/token",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    scope: "https://www.googleapis.com/auth/cloud-platform",
  })
    .setProtectedHeader({ alg: "RS256" })
    .sign(await jose.importPKCS8(serviceAccount.private_key, "RS256"));

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await res.json();
  return data.access_token;
}

async function sendPushNotification(supabase: any, userId: string, title: string, body: string) {
  const serviceAccountJson = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
  if (!serviceAccountJson) {
    console.error('FIREBASE_SERVICE_ACCOUNT secret not found');
    return;
  }
  
  const serviceAccount = JSON.parse(serviceAccountJson);
  
  const { data: tokenRows } = await supabase
    .from('user_push_tokens')
    .select('token')
    .eq('user_id', userId);
  
  if (!tokenRows || tokenRows.length === 0) {
    console.log(`No push tokens found for user: ${userId}`);
    return;
  }

  try {
    const accessToken = await getAccessToken(serviceAccount);
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;

    for (const row of tokenRows) {
      await fetch(fcmUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            token: row.token,
            notification: { title, body },
            webpush: {
              fcm_options: {
                link: '/'
              }
            }
          },
        }),
      });
    }
    console.log(`Pushed notification to ${tokenRows.length} devices for user ${userId}`);
  } catch (err) {
    console.error('FCM Push Error:', err);
  }
}

// SePay webhook request payload shape
interface SePayWebhookPayload {
  id: number;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  subAccount?: string;
  code?: string;
  content: string; // Nội dung chuyển khoản
  transferType: string;
  transferAmount: number; // Số tiền
  accumulated: number;
  referenceCode: string; // Mã tham chiếu (Mã giao dịch ngân hàng)
  description?: string;
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type'); // 'admin' | 'host'
    const hostId = url.searchParams.get('hostId');
    const token = url.searchParams.get('token');

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload: SePayWebhookPayload = await req.json();

    // Use Service Role Key to bypass RLS since webhooks are unauthenticated external incoming requests
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { content, transferAmount } = payload;
    const upperContent = content.toUpperCase();

    // --- 1. ADMIN WEBHOOK (Host upgrade plan) ---
    if (type === 'admin') {
      // Logic for admin
      // Lấy admin_settings
      const { data: settingsRow, error: settingsError } = await supabaseClient
        .from('admin_settings')
        .select('*')
        .eq('id', 'admin')
        .single();
      
      if (settingsError || !settingsRow) {
        throw new Error('Admin settings not found');
      }

      // TODO: Xác thực webhook Token của admin nếu có cấu hình
      // Để đơn giản, SePay payload content chứa mã paymentCode (Vd: PAY_123)
      const settings = settingsRow as any;
      const requests = settings.subscription_requests || [];
      
      let matchedRequestIndex = -1;
      let matchedRequest = null;

      for (let i = 0; i < requests.length; i++) {
        const req = requests[i];
        if (req.status === 'pending_payment' && req.paymentCode && upperContent.includes(req.paymentCode.toUpperCase())) {
          matchedRequestIndex = i;
          matchedRequest = req;
          break;
        }
      }

      if (matchedRequest) {
        // Cập nhật trạng thái
        requests[matchedRequestIndex].status = 'approved';
        requests[matchedRequestIndex].reviewedAt = new Date().toISOString();
        requests[matchedRequestIndex].adminNote = `SePay Auto-approved. Amount: ${transferAmount}`;

        // Cập nhật user plan (gia hạn/mua gói)
        const { data: userRow } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', matchedRequest.hostId)
            .single();

        if (userRow) {
            let updates: any = {};
            if (matchedRequest.requestedPlanId) {
                updates.subscription_plan_id = matchedRequest.requestedPlanId;
                // Nếu đang có gói, cộng dồn ngày, nếu chưa thì bắt đầu từ hôm nay
                const now = new Date();
                const currentEnd = userRow.subscription_end_date ? new Date(userRow.subscription_end_date) : now;
                const newEnd = currentEnd > now ? currentEnd : now;
                // Giả sử các gói luôn gia hạn 30 ngày (Trong thực tế cần query plan để biết số ngày)
                newEnd.setDate(newEnd.getDate() + 30);
                updates.subscription_start_date = userRow.subscription_start_date || now.toISOString();
                updates.subscription_end_date = newEnd.toISOString();
            }

            await supabaseClient.from('users').update(updates).eq('id', matchedRequest.hostId);
        }

        const { error: updateError } = await supabaseClient
            .from('admin_settings')
            .update({ subscription_requests: requests })
            .eq('id', 'admin');

        if (updateError) throw updateError;

        // --- PUSH NOTIFICATION TO ADMIN ---
        try {
          // Fetch all super admins to notify
          const { data: admins } = await supabaseClient
            .from('users')
            .select('id')
            .eq('role', 'SUPER_ADMIN');
          
          if (admins) {
            for (const admin of admins) {
              await sendPushNotification(
                supabaseClient, 
                admin.id, 
                '💎 Gói dịch vụ mới', 
                `Chủ nhà ${userRow.name || matchedRequest.hostId} vừa thanh toán thành công qua SePay.`
              );
            }
          }
        } catch (pushErr) {
          console.error('Admin push error:', pushErr);
        }

        return new Response(JSON.stringify({ success: true, message: 'Admin payment processed' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
         return new Response(JSON.stringify({ success: true, message: 'No matching admin request found, skipped.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // --- 2. HOST WEBHOOK (Tenant pay room bill) ---
    if (type === 'host' && hostId) {
      if (!token) {
        throw new Error('Missing token for host webhook');
      }

      // Lấy dữ liệu host
      const { data: snapRow, error: snapError } = await supabaseClient
        .from('host_data_snapshots')
        .select('*')
        .eq('host_id', hostId)
        .single();
      
      if (snapError || !snapRow) {
        throw new Error('Host data not found');
      }

      const hostData = snapRow.data;
      
      // Xác thực token
      const gatewayConfig = hostData?.subscriptionSnapshot?.paymentGateway;
      // Note: AdminSettings có thể chứa providerLabel, mã webhookToken nằm chung config không?
      // Thường thì HostPaymentGatewayConfig chứa token ở đây
      const actualToken = gatewayConfig?.webhookToken || token; 
      // Do trong types.ts hostData.subscriptionSnapshot.paymentGateway chỉ pick vài fields.
      // Chúng ta phải xem cấu hình Webhook thực sự lưu ở đâu. Tạm thời check trùng khớp token URL
      // (Nếu config có webhookToken thì verify)

      // Cập nhật webhook status lastWebhookAt
      if (!hostData.subscriptionSnapshot) hostData.subscriptionSnapshot = { hostId } as any;
      if (!hostData.subscriptionSnapshot.paymentGateway) hostData.subscriptionSnapshot.paymentGateway = {} as any;
      
      hostData.subscriptionSnapshot.paymentGateway.lastWebhookAt = new Date().toISOString();
      hostData.subscriptionSnapshot.paymentGateway.lastWebhookMessage = `SePay nhận ${transferAmount}đ - ND: ${content}`;

      // Tìm bill tương ứng trong nội dung chuyển khoản
      // Lời nhắn thường có dạng "NHA TRO PHONG ... BL_1234..."
      const match = upperContent.match(/BL_[A-Z0-9_]+/);
      if (!match) {
         hostData.subscriptionSnapshot.paymentGateway.lastWebhookStatus = 'Failed: Không tìm thấy mã BL_';
         // Lưu lại status nhưng không gạch nợ
         await supabaseClient.from('host_data_snapshots').update({ data: hostData }).eq('host_id', hostId);
         return new Response(JSON.stringify({ success: true, message: 'No bill ID found in content' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         });
      }

      const billIdKey = match[0]; // Vd: BL_123_042026
      // Phân tách billId ra roomId/contractId và period
      // Do payment.id không phải lúc nào cũng là billId (RoomBill là nhóm các payments). 
      // Cho nên phải tìm các payments có khóa "roomId:period" hoặc thuộc billId.
      let totalAmountToDistribute = transferAmount;
      const payments = hostData.payments || [];
      let updatedCount = 0;

      // Tìm payments theo khóa phân loại trong RoomBill (tương tự thuật toán tính RoomBill.id)
      // ID dạng BL_... là roomId_period hoặc contractId_period thay vì chứa /
      const billIdBase = billIdKey.replace(/^BL_/, ''); // VD: 123_4_2026
      
      for (const p of payments) {
          if (p.direction === 'expense') continue;
          
          // Generate pseudo billKey current payment would belong to 
          const contract = (hostData.contracts || []).find((c: any) => c.id === p.contractId);
          const room = contract ? (hostData.rooms || []).find((r: any) => r.id === contract.roomId) : null;
          
          const pBillKey = `${room?.id || p.contractId}:${p.period}`.replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase();

          if (pBillKey === billIdBase && p.status !== 'Đã đóng') {
              // Phân bổ tiền nợ
              const paidSoFar = p.paidAmount || 0;
              const remaining = p.amount - paidSoFar;
              if (remaining > 0) {
                 const applied = Math.min(totalAmountToDistribute, remaining);
                 p.paidAmount = paidSoFar + applied;
                 totalAmountToDistribute -= applied;
                 
                 p.paidDate = new Date().toISOString();
                 p.paymentMethod = 'sepay';

                 if (p.paidAmount >= p.amount) {
                     p.status = 'Đã đóng';
                 } else if (p.paidAmount > 0) {
                     p.status = 'Thanh toán một phần';
                 }
                 updatedCount++;
              }
              if (totalAmountToDistribute <= 0) break;
          }
      }

      hostData.subscriptionSnapshot.paymentGateway.lastWebhookStatus = updatedCount > 0 ? 'Thành công' : 'Thất bại: Không có nợ hoặc tiền ko khớp';

      const { error: updateHostError } = await supabaseClient
          .from('host_data_snapshots')
          .update({ data: hostData, updated_at: new Date().toISOString() })
          .eq('host_id', hostId);

      if (updateHostError) throw updateHostError;

      // --- PUSH NOTIFICATION TO HOST ---
      if (updatedCount > 0) {
        try {
          const roomNames = Array.from(new Set(
            payments
              .filter((p: any) => p.status === 'Đã đóng' && p.paymentMethod === 'sepay')
              .map((p: any) => {
                const contract = (hostData.contracts || []).find((c: any) => c.id === p.contractId);
                const room = contract ? (hostData.rooms || []).find((r: any) => r.id === contract.roomId) : null;
                return room?.name || 'Phòng';
              })
          )).join(', ');

          await sendPushNotification(
            supabaseClient,
            hostId,
            '💰 Tiền về! Tiền về!',
            `${roomNames} vừa đóng ${transferAmount.toLocaleString()}đ qua SePay.`
          );
        } catch (pushErr) {
          console.error('Host push error:', pushErr);
        }
      }

      return new Response(JSON.stringify({ success: true, message: `Host payment processed, updated ${updatedCount} payments` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, message: 'Invalid type or missing parameters' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
