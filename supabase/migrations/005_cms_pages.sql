-- ═══════════════════════════════════════════════════
-- CMS Pages table for landing page dynamic content
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content_html TEXT DEFAULT '',
    meta_description TEXT DEFAULT '',
    is_published BOOLEAN DEFAULT false,
    category TEXT DEFAULT 'legal' CHECK (category IN ('legal', 'support', 'company')),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

-- Public can read published pages
CREATE POLICY "Anyone can read published pages"
ON public.cms_pages FOR SELECT
USING (is_published = true);

-- Service role has full access (for admin writes via Edge Functions or service client)
CREATE POLICY "Service role has full access"
ON public.cms_pages FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON public.cms_pages TO anon;
GRANT SELECT ON public.cms_pages TO authenticated;
GRANT ALL ON public.cms_pages TO service_role;

-- Seed default pages
INSERT INTO public.cms_pages (slug, title, content_html, meta_description, is_published, category, sort_order)
VALUES
  ('dieu-khoan-su-dung', 'Điều khoản sử dụng', '<h2>Điều khoản sử dụng</h2><p>Chào mừng bạn đến với Smart Rental AI. Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản sau...</p>', 'Điều khoản sử dụng dịch vụ Smart Rental AI - Nền tảng quản lý nhà trọ thông minh.', true, 'legal', 1),
  ('chinh-sach-bao-mat', 'Chính sách bảo mật', '<h2>Chính sách bảo mật</h2><p>Smart Rental AI cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi thu thập và sử dụng thông tin theo chính sách này...</p>', 'Chính sách bảo mật của Smart Rental AI - Cam kết bảo vệ dữ liệu người dùng.', true, 'legal', 2),
  ('ve-chung-toi', 'Về chúng tôi', '<h2>Về Smart Rental AI</h2><p>Chúng tôi là đội ngũ tiên phong trong việc số hóa quản lý nhà trọ tại Việt Nam. Sứ mệnh của chúng tôi là giúp mọi chủ nhà quản lý tốt hơn với chi phí thấp nhất...</p>', 'Giới thiệu về Smart Rental AI - Nền tảng quản lý nhà trọ số 1 Việt Nam.', true, 'company', 3),
  ('lien-he', 'Liên hệ', '<h2>Liên hệ với chúng tôi</h2><p><strong>Email:</strong> support@smartrental.ai</p><p><strong>Điện thoại:</strong> 1800 000 000</p><p><strong>Giờ làm việc:</strong> 8:00 - 17:00, Thứ 2 - Thứ 6</p>', 'Thông tin liên hệ Smart Rental AI - Hỗ trợ khách hàng 24/7.', true, 'support', 4)
ON CONFLICT (slug) DO NOTHING;
