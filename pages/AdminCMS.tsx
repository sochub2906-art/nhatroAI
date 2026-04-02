/**
 * ═══════════════════════════════════════════════════
 * Admin CMS — Block-Based Visual Page Builder
 * ═══════════════════════════════════════════════════
 * Elementor-inspired page builder with 3-panel layout:
 * Left: Block Palette | Center: Live Canvas | Right: Block Settings
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
    Plus, Search, Edit3, Trash2, Globe, EyeOff, Save, X, ArrowLeft,
    Loader2, Link, Eye, Blocks, FileText, Copy
} from 'lucide-react';
import { sbGetCmsPages, sbUpsertCmsPage, sbDeleteCmsPage } from '../services/supabaseService';
import { CmsPage, CmsBlock, CmsBlockType } from '../types';
import BlockPalette from '../components/cms/BlockPalette';
import BlockCanvas from '../components/cms/BlockCanvas';
import BlockSettings from '../components/cms/BlockSettings';

function newBlockId(): string {
    return 'blk_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
}

function createDefaultBlock(type: CmsBlockType): CmsBlock {
    const defaults: Record<CmsBlockType, Record<string, any>> = {
        hero: { title: 'Tiêu đề trang', subtitle: 'Mô tả ngắn gọn', ctaText: 'Bắt đầu', ctaUrl: '#/login', alignment: 'left' },
        text: { html: '<h2>Tiêu đề</h2><p>Nội dung chi tiết...</p>' },
        features: { heading: 'Tính năng nổi bật', columns: 3, items: [
            { icon: '⚡', title: 'Tính năng 1', description: 'Mô tả tính năng 1' },
            { icon: '🛡️', title: 'Tính năng 2', description: 'Mô tả tính năng 2' },
            { icon: '📊', title: 'Tính năng 3', description: 'Mô tả tính năng 3' },
        ]},
        'image-text': { title: 'Tiêu đề', description: 'Mô tả chi tiết...', imagePosition: 'right' },
        faq: { heading: 'Câu hỏi thường gặp', items: [
            { question: 'Câu hỏi mẫu?', answer: 'Câu trả lời mẫu.' },
        ]},
        cta: { title: 'Sẵn sàng bắt đầu?', description: 'Đăng ký miễn phí ngay hôm nay', buttonText: 'Bắt đầu ngay', buttonUrl: '#/login' },
        stats: { items: [
            { value: '1000', suffix: '+', label: 'Khách hàng' },
            { value: '500', suffix: '+', label: 'Nhà trọ' },
            { value: '99', suffix: '%', label: 'Hài lòng' },
            { value: '24/7', label: 'Hỗ trợ' },
        ]},
        divider: { height: 48, style: 'line' },
        testimonials: { heading: 'Khách hàng nói gì?', items: [
            { quote: 'Dịch vụ rất tuyệt vời!', author: 'Nguyễn A', role: 'Chủ nhà trọ' },
        ]},
        gallery: { heading: 'Thư viện ảnh', columns: 3, images: [] },
    };

    return {
        id: newBlockId(),
        type,
        data: defaults[type] || {},
        style: { padding: 'lg', maxWidth: 'lg' },
    };
}

export default function AdminCMS() {
    const [pages, setPages] = useState<CmsPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Editor state
    const [editingPage, setEditingPage] = useState<Partial<CmsPage> | null>(null);
    const [saving, setSaving] = useState(false);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    useEffect(() => { fetchPages(); }, []);

    const fetchPages = async () => {
        setLoading(true);
        const data = await sbGetCmsPages();
        setPages(data);
        setLoading(false);
    };

    const handleEdit = (page: CmsPage) => {
        setEditingPage({ ...page, contentBlocks: page.contentBlocks || [] });
        setSelectedBlockId(null);
    };

    const handleCreateNew = () => {
        setEditingPage({
            slug: '',
            title: '',
            contentHtml: '',
            contentBlocks: [],
            metaDescription: '',
            isPublished: false,
            category: 'legal',
            sortOrder: 0,
        });
        setSelectedBlockId(null);
    };

    const handleDuplicate = (page: CmsPage) => {
        setEditingPage({
            ...page,
            id: undefined,
            slug: page.slug + '-copy',
            title: page.title + ' (Bản sao)',
            contentBlocks: page.contentBlocks?.map(b => ({ ...b, id: newBlockId() })) || [],
            isPublished: false,
        });
        setSelectedBlockId(null);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa trang này? Hành động này không thể hoàn tác.')) return;
        setLoading(true);
        await sbDeleteCmsPage(id);
        await fetchPages();
    };

    const handleSave = async () => {
        if (!editingPage) return;
        if (!editingPage.slug || !editingPage.title) {
            alert('Vui lòng nhập Đường dẫn (Slug) và Tiêu đề.');
            return;
        }

        const formattedSlug = editingPage.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

        setSaving(true);
        const result = await sbUpsertCmsPage({
            ...editingPage,
            slug: formattedSlug,
            contentBlocks: blocks,
        } as any);
        setSaving(false);

        if (result.success) {
            setEditingPage(null);
            setSelectedBlockId(null);
            await fetchPages();
        } else {
            alert(`Đã có lỗi xảy ra: ${result.error}`);
        }
    };

    // ═══════════════════════════════════════
    // BLOCK MANAGEMENT
    // ═══════════════════════════════════════
    const blocks: CmsBlock[] = (editingPage?.contentBlocks as CmsBlock[]) || [];

    const setBlocks = useCallback((newBlocks: CmsBlock[]) => {
        if (!editingPage) return;
        setEditingPage(prev => prev ? { ...prev, contentBlocks: newBlocks } : prev);
    }, [editingPage]);

    const handleAddBlock = (type: CmsBlockType) => {
        const newBlock = createDefaultBlock(type);
        setBlocks([...blocks, newBlock]);
        setSelectedBlockId(newBlock.id);
    };

    const handleMoveBlock = (id: string, dir: 'up' | 'down') => {
        const idx = blocks.findIndex(b => b.id === id);
        if (idx < 0) return;
        const target = dir === 'up' ? idx - 1 : idx + 1;
        if (target < 0 || target >= blocks.length) return;
        const copy = [...blocks];
        [copy[idx], copy[target]] = [copy[target], copy[idx]];
        setBlocks(copy);
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
        if (selectedBlockId === id) setSelectedBlockId(null);
    };

    const handleUpdateBlock = (updated: CmsBlock) => {
        setBlocks(blocks.map(b => b.id === updated.id ? updated : b));
    };

    const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

    // ═══════════════════════════════════════
    // LIST VIEW FILTERS
    // ═══════════════════════════════════════
    const filteredPages = pages.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase())
    );

    // ═══════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════
    return (
        <div className="max-w-[1600px] mx-auto">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Blocks className="text-blue-500" /> Quản lý nội dung (CMS)
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Visual Page Builder — Tạo trang đẹp chỉ với vài click
                    </p>
                </div>

                {!editingPage && (
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition shadow-sm font-semibold cursor-pointer"
                    >
                        <Plus size={18} /> Tạo trang mới
                    </button>
                )}
            </div>

            {editingPage ? (
                /* ═══════════════════════════════════════ */
                /* BLOCK BUILDER EDITOR (3-panel layout)  */
                /* ═══════════════════════════════════════ */
                <div className="space-y-4">
                    {/* Top bar: Page meta + save */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                            <button
                                onClick={() => { setEditingPage(null); setSelectedBlockId(null); }}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                            >
                                <ArrowLeft size={16} /> Quay lại
                            </button>

                            <div className="flex flex-wrap items-center gap-3">
                                {editingPage.id && (
                                    <a
                                        href={`#/p/${editingPage.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-400 transition"
                                    >
                                        <Eye size={14} /> Xem trang
                                    </a>
                                )}
                                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                        checked={editingPage.isPublished}
                                        onChange={e => setEditingPage({ ...editingPage, isPublished: e.target.checked })}
                                    />
                                    Công khai
                                </label>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded-xl transition shadow-sm font-semibold cursor-pointer"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Lưu xuất bản
                                </button>
                            </div>
                        </div>

                        {/* Page meta fields */}
                        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Tiêu đề trang *</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    value={editingPage.title}
                                    onChange={e => {
                                        const title = e.target.value;
                                        if (!editingPage.id && !editingPage.slug) {
                                            const slug = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
                                            setEditingPage({ ...editingPage, title, slug });
                                        } else {
                                            setEditingPage({ ...editingPage, title });
                                        }
                                    }}
                                    placeholder="VD: Điều khoản sử dụng"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Slug (URL)</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">/p/</span>
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        value={editingPage.slug}
                                        onChange={e => setEditingPage({ ...editingPage, slug: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Chuyên mục</label>
                                <select
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    value={editingPage.category || 'legal'}
                                    onChange={e => setEditingPage({ ...editingPage, category: e.target.value as any })}
                                >
                                    <option value="company">Về công ty</option>
                                    <option value="support">Hỗ trợ</option>
                                    <option value="legal">Pháp lý</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Meta Description (SEO)</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    value={editingPage.metaDescription || ''}
                                    onChange={e => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                                    placeholder="Mô tả cho Google..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3-Panel Builder Layout */}
                    <div className="grid grid-cols-12 gap-4" style={{ minHeight: 'calc(100vh - 280px)' }}>
                        {/* LEFT: Block Palette */}
                        <div className="col-span-12 lg:col-span-2 order-2 lg:order-1">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 lg:sticky lg:top-4">
                                <BlockPalette onAddBlock={handleAddBlock} />
                            </div>
                        </div>

                        {/* CENTER: Canvas (Preview) */}
                        <div className={`order-1 lg:order-2 ${selectedBlock ? 'col-span-12 lg:col-span-7' : 'col-span-12 lg:col-span-10'}`}>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 lg:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                        <Eye size={16} /> Preview
                                    </h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        {blocks.length} block{blocks.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <BlockCanvas
                                    blocks={blocks}
                                    selectedBlockId={selectedBlockId}
                                    onSelectBlock={setSelectedBlockId}
                                    onMoveBlock={handleMoveBlock}
                                    onDeleteBlock={handleDeleteBlock}
                                />
                            </div>
                        </div>

                        {/* RIGHT: Block Settings */}
                        {selectedBlock && (
                            <div className="col-span-12 lg:col-span-3 order-3">
                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 lg:sticky lg:top-4 max-h-[calc(100vh-150px)] overflow-y-auto">
                                    <BlockSettings
                                        block={selectedBlock}
                                        onChange={handleUpdateBlock}
                                        onClose={() => setSelectedBlockId(null)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* ═══════════════════════════════════════ */
                /* PAGE LIST VIEW                          */
                /* ═══════════════════════════════════════ */
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center gap-4 bg-slate-50 dark:bg-slate-900/50">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm trang..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Trang</th>
                                    <th className="px-6 py-4 font-medium hidden md:table-cell">Slug</th>
                                    <th className="px-6 py-4 font-medium hidden sm:table-cell">Blocks</th>
                                    <th className="px-6 py-4 font-medium">Trạng thái</th>
                                    <th className="px-6 py-4 font-medium text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <Loader2 className="animate-spin mx-auto mb-2 text-blue-500" size={24} />
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : filteredPages.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <FileText className="mx-auto mb-2 text-slate-400 opacity-50" size={28} />
                                            Chưa có trang nào.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPages.map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-slate-900 dark:text-slate-200">{p.title}</p>
                                                <p className="text-xs text-slate-400 mt-0.5 capitalize">
                                                    {p.category === 'legal' ? 'Pháp lý' : p.category === 'support' ? 'Hỗ trợ' : 'Về công ty'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <a
                                                    href={`#/p/${p.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-500 transition-colors text-xs"
                                                >
                                                    /p/{p.slug} <Link size={10} />
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                                                    <Blocks size={10} /> {(p.contentBlocks?.length || 0)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {p.isPublished ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                        <Globe size={12} /> Công khai
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                        <EyeOff size={12} /> Nháp
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleEdit(p)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition cursor-pointer"
                                                    title="Sửa"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDuplicate(p)}
                                                    className="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 rounded-lg transition cursor-pointer"
                                                    title="Nhân bản"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition cursor-pointer"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
