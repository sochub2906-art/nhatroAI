/**
 * ═══════════════════════════════════════════════════
 * Dynamic Page — Public CMS page renderer
 * ═══════════════════════════════════════════════════
 * Renders block-based content with fallback to legacy HTML.
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { sbGetCmsPages } from '../services/supabaseService';
import { CmsPage } from '../types';
import LandingFooter from '../components/LandingFooter';
import BlockRenderer from '../components/cms/BlockRenderer';

export default function DynamicPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState<CmsPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            const data = await sbGetCmsPages();
            const found = data.find(p => p.slug === slug && p.isPublished);
            setPage(found || null);
            setLoading(false);
        };
        fetchPage();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#060b17]">
                <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse" />
            </div>
        );
    }

    if (!page) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#060b17] text-white">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-slate-400 mb-8">Trang không tồn tại hoặc đã bị gỡ.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 rounded-full bg-blue-600 font-medium text-white hover:bg-blue-700 transition cursor-pointer"
                >
                    Về trang chủ
                </button>
            </div>
        );
    }

    const hasBlocks = page.contentBlocks && page.contentBlocks.length > 0;

    return (
        <div className="min-h-screen flex flex-col bg-[#060b17] text-slate-100 selection:bg-blue-500 selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-left text-2xl font-black tracking-tight text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text"
                    >
                        Smart Rental
                    </button>

                    <div className="hidden items-center gap-6 lg:flex">
                        <button onClick={() => navigate('/')} className="text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer">Về trang chủ</button>
                        <button onClick={() => navigate('/pricing')} className="text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer">Bảng giá</button>
                        <button onClick={() => navigate('/login')} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 cursor-pointer">Bắt đầu</button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowMobileMenu(prev => !prev)}
                        className="inline-flex rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 lg:hidden cursor-pointer"
                    >
                        {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {showMobileMenu && (
                    <div className="border-t border-white/10 bg-slate-950/95 px-5 pb-5 pt-4 lg:hidden">
                        <div className="flex flex-col gap-3">
                            <button onClick={() => { setShowMobileMenu(false); navigate('/'); }} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white cursor-pointer">Về trang chủ</button>
                            <button onClick={() => { setShowMobileMenu(false); navigate('/pricing'); }} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white cursor-pointer">Bảng giá</button>
                            <button onClick={() => { setShowMobileMenu(false); navigate('/login'); }} className="rounded-2xl bg-blue-600 px-4 py-3 text-left text-sm font-semibold text-white cursor-pointer">Bắt đầu miễn phí</button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 relative">
                {/* Background glow */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                    <div className="absolute left-[-12%] top-[-8%] h-[32rem] w-[32rem] rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="absolute right-[-8%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/8 blur-3xl" />
                </div>

                <div className="relative z-10">
                    {hasBlocks ? (
                        /* ═══════ BLOCK-BASED CONTENT ═══════ */
                        <>
                            {/* Page title if no hero block */}
                            {page.contentBlocks![0].type !== 'hero' && (
                                <div className="mx-auto max-w-6xl px-5 lg:px-8 pt-16 pb-8">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <ArrowLeft size={16} /> Quay lại
                                    </button>
                                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{page.title}</h1>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 border-b border-white/10 pb-8">
                                        <span>Cập nhật: {new Date(page.updatedAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            )}
                            <BlockRenderer blocks={page.contentBlocks!} />
                        </>
                    ) : (
                        /* ═══════ LEGACY HTML CONTENT ═══════ */
                        <div className="mx-auto max-w-4xl px-5 lg:px-8 pt-12 pb-24">
                            <button
                                onClick={() => navigate(-1)}
                                className="mb-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <ArrowLeft size={16} /> Quay lại
                            </button>

                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{page.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-12 border-b border-white/10 pb-8">
                                <span>Cập nhật lúc: {new Date(page.updatedAt).toLocaleDateString('vi-VN')}</span>
                                <span className="capitalize">{page.category === 'legal' ? 'Pháp lý' : page.category === 'support' ? 'Hỗ trợ' : 'Về công ty'}</span>
                            </div>

                            <div
                                className="prose prose-invert prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-img:rounded-2xl prose-hr:border-white/10 prose-p:leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: page.contentHtml }}
                            />
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <LandingFooter />
        </div>
    );
}
