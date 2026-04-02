/**
 * ═══════════════════════════════════════════════════
 * CMS Block Renderer — Public-facing renderer
 * ═══════════════════════════════════════════════════
 * Renders CmsBlock[] into beautiful, styled sections.
 * Used in both DynamicPage (public) and BlockCanvas (admin preview).
 */
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Quote, ArrowRight } from 'lucide-react';
import type { CmsBlock, CmsBlockStyle } from '../../types';

const PAD_MAP: Record<string, string> = {
    none: 'py-0',
    sm: 'py-6',
    md: 'py-12',
    lg: 'py-20',
    xl: 'py-28',
};

const WIDTH_MAP: Record<string, string> = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
};

function sectionClasses(style?: CmsBlockStyle): string {
    const pad = PAD_MAP[style?.padding || 'lg'];
    const width = WIDTH_MAP[style?.maxWidth || 'lg'];
    return `${pad} px-5 lg:px-8 mx-auto ${width} w-full`;
}

function sectionStyle(style?: CmsBlockStyle): React.CSSProperties {
    const s: React.CSSProperties = {};
    if (style?.bgColor) s.backgroundColor = style.bgColor;
    if (style?.textColor) s.color = style.textColor;
    return s;
}

// ════════════════════════════════════════
// HERO BLOCK
// ════════════════════════════════════════
function HeroBlock({ data, style }: { data: any; style?: CmsBlockStyle }) {
    const align = data.alignment === 'center' ? 'text-center items-center' : 'text-left items-start';
    return (
        <section
            className="relative overflow-hidden"
            style={{
                ...sectionStyle(style),
                backgroundImage: data.bgImage ? `url(${data.bgImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {(data.bgImage || style?.darkOverlay) && (
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90" />
            )}
            <div className={`${sectionClasses(style)} relative z-10 flex flex-col ${align}`}>
                {data.badge && (
                    <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
                        {data.badge}
                    </span>
                )}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] max-w-4xl">
                    {data.title || 'Tiêu đề Hero'}
                </h1>
                {data.subtitle && (
                    <p className="mt-6 text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                        {data.subtitle}
                    </p>
                )}
                {data.ctaText && (
                    <div className="mt-10 flex flex-wrap gap-4">
                        <a
                            href={data.ctaUrl || '#'}
                            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02]"
                        >
                            {data.ctaText}
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                        </a>
                        {data.secondaryCtaText && (
                            <a
                                href={data.secondaryCtaUrl || '#'}
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                            >
                                {data.secondaryCtaText}
                            </a>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

// ════════════════════════════════════════
// TEXT BLOCK
// ════════════════════════════════════════
function TextBlock({ data, style }: { data: any; style?: CmsBlockStyle }) {
    return (
        <section style={sectionStyle(style)}>
            <div className={sectionClasses(style)}>
                <div
                    className="prose prose-invert prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-img:rounded-2xl prose-hr:border-white/10 prose-p:leading-relaxed prose-li:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: data.html || '' }}
                />
            </div>
        </section>
    );
}

// ════════════════════════════════════════
// FEATURES BLOCK
// ════════════════════════════════════════
function FeaturesBlock({ data, style }: { data: any; style?: CmsBlockStyle }) {
    const items: { icon?: string; title: string; description: string }[] = data.items || [];
    const cols = data.columns || 3;
    const colClass = cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';

    const iconColors = [
        'from-blue-500 to-cyan-400',
        'from-emerald-500 to-teal-400',
        'from-amber-500 to-orange-400',
        'from-rose-500 to-pink-400',
        'from-violet-500 to-purple-400',
        'from-sky-500 to-indigo-400',
    ];

    return (
        <section style={sectionStyle(style)}>
            <div className={sectionClasses(style)}>
                {data.heading && (
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">{data.heading}</h2>
                        {data.subheading && <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">{data.subheading}</p>}
                    </div>
                )}
                <div className={`grid gap-6 ${colClass}`}>
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-7 transition-all hover:border-white/10 hover:bg-white/[0.05]"
                        >
                            <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${iconColors[i % iconColors.length]} text-white shadow-lg`}>
                                <span className="text-lg font-bold">{item.icon || (i + 1)}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ════════════════════════════════════════
// IMAGE + TEXT BLOCK
// ════════════════════════════════════════
function ImageTextBlock({ data, style }: { data: any; style?: CmsBlockStyle }) {
    const isRight = data.imagePosition === 'right';
    return (
        <section style={sectionStyle(style)}>
            <div className={sectionClasses(style)}>
                <div className={`flex flex-col ${isRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                    <div className="flex-1 space-y-5">
                        {data.badge && (
                            <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                                {data.badge}
                            </span>
                        )}
                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">{data.title || 'Tiêu đề'}</h2>
                        <p className="text-slate-400 text-base leading-relaxed">{data.description || ''}</p>
                        {data.ctaText && (
                            <a href={data.ctaUrl || '#'} className="inline-flex items-center gap-2 text-blue-400 text-sm font-semibold hover:text-blue-300 transition">
                                {data.ctaText} <ArrowRight size={14} />
                            </a>
                        )}
                    </div>
                    <div className="flex-1 w-full">
                        {data.imageUrl ? (
                            <img src={data.imageUrl} alt={data.title || ''} className="w-full rounded-2xl border border-white/10 shadow-xl" />
                        ) : (
                            <div className="aspect-video rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-600 text-sm">
                                Chưa có hình ảnh
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ════════════════════════════════════════
// FAQ BLOCK
// ════════════════════════════════════════
function FAQBlock({ data, style }: { data: any; style?: CmsBlockStyle }) {
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const items: { question: string; answer: string }[] = data.items || [];

    return (
        <section style={sectionStyle(style)}>
            <div className={sectionClasses(style)}>
                {data.heading && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">{data.heading}</h2>
                        {data.subheading && <p className="mt-4 text-lg text-slate-400">{data.subheading}</p>}
                    </div>
                )}
                <div className="max-w-3xl mx-auto space-y-3">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-colors hover:border-white/10"
                        >
                            <button
                                type="button"
                                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                            >
                                <span className="font-semibold text-white text-[0.95rem]">{item.question}</span>
                                {openIdx === i ? <ChevronUp size={18} className="text-blue-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-500 shrink-0" />}
                            </button>
                            {openIdx === i && (
                                <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/[0.04] pt-4">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ════════════════════════════════════════
// CTA BLOCK
// ════════════════════════════════════════
function CTABlock({ data, style }: { data: any; style?: CmsBlockStyle }) {
    return (
        <section style={sectionStyle(style)}>
            <div className={sectionClasses(style)}>
                <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-blue-600/20 via-slate-900 to-cyan-600/20 px-8 py-16 text-center">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
                    </div>
                    <div className="relative z-10 mx-auto max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{data.title || 'Sẵn sàng bắt đầu?'}</h2>
                        {data.description && <p className="text-lg text-slate-300 mb-8">{data.description}</p>}
                        {data.buttonText && (
                            <a
                                href={data.buttonUrl || '#'}
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02]"
                            >
                                {data.buttonText}
                                <ArrowRight size={16} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ════════════════════════════════════════
// STATS BLOCK
// ════════════════════════════════════════
function StatsBlock({ data, style }: { data: any; style?: CmsBlockStyle }) {
    const items: { value: string; label: string; suffix?: string }[] = data.items || [];
    return (
        <section style={sectionStyle(style)}>
            <div className={sectionClasses(style)}>
                {data.heading && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">{data.heading}</h2>
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {items.map((item, i) => (
                        <div key={i} className="text-center">
                            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                {item.value}{item.suffix || ''}
                            </div>
                            <div className="mt-2 text-sm text-slate-400 font-medium">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ════════════════════════════════════════
// DIVIDER BLOCK
// ════════════════════════════════════════
function DividerBlock({ data, style }: { data: any; style?: CmsBlockStyle }) {
    const h = data.height || 48;
    const variant = data.style || 'line';
    return (
        <section style={sectionStyle(style)}>
            <div className={sectionClasses({ ...style, padding: 'none' })} style={{ paddingTop: h / 2, paddingBottom: h / 2 }}>
                {variant === 'line' && <hr className="border-white/[0.08]" />}
                {variant === 'dots' && (
                    <div className="flex justify-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                        <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                        <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    </div>
                )}
            </div>
        </section>
    );
}

// ════════════════════════════════════════
// TESTIMONIALS BLOCK
// ════════════════════════════════════════
function TestimonialsBlock({ data, style }: { data: any; style?: CmsBlockStyle }) {
    const items: { quote: string; author: string; role?: string; avatar?: string }[] = data.items || [];
    return (
        <section style={sectionStyle(style)}>
            <div className={sectionClasses(style)}>
                {data.heading && (
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">{data.heading}</h2>
                    </div>
                )}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 flex flex-col"
                        >
                            <Quote size={24} className="text-blue-500/40 mb-4" />
                            <p className="text-slate-300 text-sm leading-relaxed flex-1">{item.quote}</p>
                            <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {item.author?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">{item.author}</div>
                                    {item.role && <div className="text-xs text-slate-500">{item.role}</div>}
                                </div>
                            </div>
                            <div className="flex gap-0.5 mt-3">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-amber-400 fill-amber-400" />)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ════════════════════════════════════════
// GALLERY BLOCK
// ════════════════════════════════════════
function GalleryBlock({ data, style }: { data: any; style?: CmsBlockStyle }) {
    const images: { url: string; caption?: string }[] = data.images || [];
    const cols = data.columns || 3;
    const colClass = cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';

    return (
        <section style={sectionStyle(style)}>
            <div className={sectionClasses(style)}>
                {data.heading && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">{data.heading}</h2>
                    </div>
                )}
                <div className={`grid gap-4 ${colClass}`}>
                    {images.map((img, i) => (
                        <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/[0.06]">
                            <img src={img.url} alt={img.caption || ''} className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
                            {img.caption && (
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                                    <p className="text-sm text-white/90">{img.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ════════════════════════════════════════
// MAIN BLOCK RENDERER
// ════════════════════════════════════════
const BLOCK_RENDERERS: Record<string, React.FC<{ data: any; style?: CmsBlockStyle }>> = {
    hero: HeroBlock,
    text: TextBlock,
    features: FeaturesBlock,
    'image-text': ImageTextBlock,
    faq: FAQBlock,
    cta: CTABlock,
    stats: StatsBlock,
    divider: DividerBlock,
    testimonials: TestimonialsBlock,
    gallery: GalleryBlock,
};

interface BlockRendererProps {
    blocks: CmsBlock[];
    onBlockClick?: (blockId: string) => void;
    selectedBlockId?: string | null;
    isEditor?: boolean;
}

export default function BlockRenderer({ blocks, onBlockClick, selectedBlockId, isEditor }: BlockRendererProps) {
    if (!blocks || blocks.length === 0) return null;

    return (
        <div className="space-y-0">
            {blocks.map((block) => {
                const Comp = BLOCK_RENDERERS[block.type];
                if (!Comp) return null;

                return (
                    <div
                        key={block.id}
                        className={`relative transition-all ${isEditor ? 'cursor-pointer group' : ''} ${selectedBlockId === block.id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 rounded-xl' : ''}`}
                        onClick={isEditor ? (e) => { e.stopPropagation(); onBlockClick?.(block.id); } : undefined}
                    >
                        <Comp data={block.data} style={block.style} />
                    </div>
                );
            })}
        </div>
    );
}
