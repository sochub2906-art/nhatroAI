import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import {
    AdminPermission,
    ADMIN_ROLE_META,
    DEFAULT_ROLE_PERMISSIONS,
    PERMISSIONS_LIST,
    PermissionMeta,
} from '../types';
import {
    Shield,
    ShieldCheck,
    ShieldAlert,
    Lock,
    Save,
    RotateCcw,
    ChevronDown,
    ChevronRight,
    Check,
    Info,
    Briefcase,
    Calculator,
    UserCog,
    Crown,
} from 'lucide-react';

const ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    SUPER_ADMIN: Crown,
    ADMIN_L2: UserCog,
    SALES: Briefcase,
    ACCOUNTANT: Calculator,
};

const ROLE_COLORS: Record<string, { bg: string; border: string; text: string; badge: string; ring: string }> = {
    SUPER_ADMIN: {
        bg: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-500',
        badge: 'bg-amber-500/15 text-amber-500',
        ring: 'ring-amber-500/20',
    },
    ADMIN_L2: {
        bg: 'bg-gradient-to-br from-sky-500/10 to-blue-500/10',
        border: 'border-sky-500/30',
        text: 'text-sky-500',
        badge: 'bg-sky-500/15 text-sky-500',
        ring: 'ring-sky-500/20',
    },
    SALES: {
        bg: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-500',
        badge: 'bg-emerald-500/15 text-emerald-500',
        ring: 'ring-emerald-500/20',
    },
    ACCOUNTANT: {
        bg: 'bg-gradient-to-br from-violet-500/10 to-purple-400/10',
        border: 'border-violet-500/30',
        text: 'text-violet-500',
        badge: 'bg-violet-500/15 text-violet-500',
        ring: 'ring-violet-500/20',
    },
};

const GROUP_LABELS: Record<string, string> = {
    core: '🏛️ Quản trị chính',
    finance: '💰 Tài chính',
    data: '📊 Dữ liệu & Nội dung',
    system: '⚙️ Hệ thống',
};

const GROUP_ORDER = ['core', 'finance', 'data', 'system'];

function groupedPermissions(): { group: string; label: string; items: PermissionMeta[] }[] {
    return GROUP_ORDER.map(g => ({
        group: g,
        label: GROUP_LABELS[g] || g,
        items: PERMISSIONS_LIST.filter(p => p.group === g),
    }));
}

export default function AdminRoles() {
    const { adminSettings, updateAdminSettings, currentUser } = useApp();

    const [rolePerms, setRolePerms] = useState<Record<string, AdminPermission[]>>({});
    const [expandedRole, setExpandedRole] = useState<string | null>('ADMIN_L2');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [dirty, setDirty] = useState(false);

    // Hydrate from adminSettings
    useEffect(() => {
        const stored = adminSettings.rolePermissions;
        const merged: Record<string, AdminPermission[]> = {};
        for (const meta of ADMIN_ROLE_META) {
            merged[meta.role] = stored?.[meta.role]?.length
                ? stored[meta.role]
                : DEFAULT_ROLE_PERMISSIONS[meta.role] || [];
        }
        setRolePerms(merged);
        setDirty(false);
    }, [adminSettings.rolePermissions]);

    const togglePerm = useCallback((role: string, perm: AdminPermission) => {
        setRolePerms(prev => {
            const current = prev[role] || [];
            const next = current.includes(perm)
                ? current.filter(p => p !== perm)
                : [...current, perm];
            return { ...prev, [role]: next };
        });
        setDirty(true);
        setSaved(false);
    }, []);

    const toggleAll = useCallback((role: string, groupItems: PermissionMeta[], checked: boolean) => {
        setRolePerms(prev => {
            const current = prev[role] || [];
            const keys = groupItems.map(i => i.key);
            const withoutGroup = current.filter(p => !keys.includes(p));
            return { ...prev, [role]: checked ? [...withoutGroup, ...keys] : withoutGroup };
        });
        setDirty(true);
        setSaved(false);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Ensure SUPER_ADMIN always has full access
            const toSave: Record<string, AdminPermission[]> = {
                ...rolePerms,
                SUPER_ADMIN: PERMISSIONS_LIST.map(p => p.key),
            };
            updateAdminSettings({ ...adminSettings, rolePermissions: toSave });
            setSaved(true);
            setDirty(false);
        } catch (err) {
            console.error('Failed to save role permissions:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        const reset: Record<string, AdminPermission[]> = {};
        for (const meta of ADMIN_ROLE_META) {
            reset[meta.role] = DEFAULT_ROLE_PERMISSIONS[meta.role] || [];
        }
        setRolePerms(reset);
        setDirty(true);
        setSaved(false);
    };

    const groups = useMemo(() => groupedPermissions(), []);

    const getPermCount = (role: string) => (rolePerms[role] || []).length;
    const totalPermCount = PERMISSIONS_LIST.length;

    if (currentUser?.role !== 'SUPER_ADMIN') {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
                    <p className="text-slate-400 font-medium">Bạn không có quyền truy cập trang này.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Phân quyền vai trò</h1>
                            <p className="text-xs text-slate-500">Cấu hình quyền hạn từng vai trò trong hệ thống</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Mặc định
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !dirty}
                        className={`px-5 py-2 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                            saved
                                ? 'bg-green-600 shadow-green-600/20'
                                : 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-600/20 hover:from-red-500 hover:to-rose-500'
                        }`}
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : saved ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>

            {/* Dirty indicator */}
            {dirty && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>Bạn có thay đổi chưa lưu. Nhấn <strong>"Lưu thay đổi"</strong> để áp dụng.</span>
                </div>
            )}

            {/* Role Cards */}
            <div className="space-y-3">
                {ADMIN_ROLE_META.map(meta => {
                    const isExpanded = expandedRole === meta.role;
                    const isLocked = !!meta.locked;
                    const colors = ROLE_COLORS[meta.role] || ROLE_COLORS.ADMIN_L2;
                    const Icon = ROLE_ICONS[meta.role] || Shield;
                    const count = getPermCount(meta.role);

                    return (
                        <div
                            key={meta.role}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                isExpanded
                                    ? `${colors.bg} ${colors.border} shadow-lg ring-1 ${colors.ring}`
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                        >
                            {/* Role Header */}
                            <button
                                onClick={() => setExpandedRole(isExpanded ? null : meta.role)}
                                className="w-full flex items-center gap-4 p-4 sm:p-5 text-left group"
                            >
                                <div
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                        isExpanded ? 'bg-white/15 dark:bg-white/10' : 'bg-slate-100 dark:bg-slate-800'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 ${isExpanded ? colors.text : 'text-slate-400'} transition-colors`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-sm">{meta.label}</p>
                                        {isLocked && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                                                <Lock className="w-3 h-3" /> Khóa
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{meta.desc}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>
                                        {count}/{totalPermCount}
                                    </span>
                                    {isExpanded ? (
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                    )}
                                </div>
                            </button>

                            {/* Permission Grid (expanded) */}
                            {isExpanded && (
                                <div className="px-4 sm:px-5 pb-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                    {isLocked && (
                                        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-600 dark:text-amber-400 text-xs">
                                            <Lock className="w-3.5 h-3.5 shrink-0" />
                                            Super Admin luôn có toàn quyền hệ thống. Không thể chỉnh sửa.
                                        </div>
                                    )}

                                    {groups.map(group => {
                                        const allChecked = group.items.every(item =>
                                            (rolePerms[meta.role] || []).includes(item.key),
                                        );
                                        const someChecked =
                                            !allChecked &&
                                            group.items.some(item => (rolePerms[meta.role] || []).includes(item.key));

                                        return (
                                            <div key={group.group}>
                                                {/* Group Header */}
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                        {group.label}
                                                    </span>
                                                    {!isLocked && (
                                                        <button
                                                            onClick={() => toggleAll(meta.role, group.items, !allChecked)}
                                                            className="ml-auto text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                                        >
                                                            {allChecked ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Permission Items */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {group.items.map(item => {
                                                        const checked = (rolePerms[meta.role] || []).includes(item.key);
                                                        return (
                                                            <label
                                                                key={item.key}
                                                                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                                                                    isLocked
                                                                        ? 'opacity-60 cursor-not-allowed'
                                                                        : checked
                                                                          ? 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-slate-700 shadow-sm'
                                                                          : 'bg-transparent border-slate-100 dark:border-slate-800 hover:bg-white/40 dark:hover:bg-white/5'
                                                                }`}
                                                            >
                                                                <div className="pt-0.5">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={checked}
                                                                        disabled={isLocked}
                                                                        onChange={() => togglePerm(meta.role, item.key)}
                                                                        className="sr-only peer"
                                                                    />
                                                                    <div
                                                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                                            checked
                                                                                ? `${colors.text} border-current bg-current/10`
                                                                                : 'border-slate-300 dark:border-slate-600'
                                                                        }`}
                                                                    >
                                                                        {checked && <Check className="w-3.5 h-3.5 text-current" />}
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium leading-tight">{item.label}</p>
                                                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{item.desc}</p>
                                                                </div>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-400" />
                    Hướng dẫn
                </h3>
                <ul className="text-xs text-slate-500 space-y-1.5 leading-relaxed">
                    <li>• <strong>Super Admin</strong> luôn có toàn quyền, không thể chỉnh sửa.</li>
                    <li>• <strong>Admin cấp 2</strong> là người hỗ trợ quản trị, có thể bị giới hạn một số quyền nhạy cảm.</li>
                    <li>• <strong>Nhân viên Sales</strong> chỉ cần truy cập dashboard, quản lý host và lead.</li>
                    <li>• <strong>Kế toán</strong> tập trung vào doanh thu, thanh toán và xuất báo cáo.</li>
                    <li>• Thay đổi quyền sẽ áp dụng <strong>lần đăng nhập tiếp theo</strong> của người dùng.</li>
                </ul>
            </div>
        </div>
    );
}
