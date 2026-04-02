/**
 * ═══════════════════════════════════════════════════
 * CMS Block Settings — Config panel for each block type
 * ═══════════════════════════════════════════════════
 */
import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Plus, Trash2, X } from 'lucide-react';
import type { CmsBlock, CmsBlockStyle } from '../../types';

interface BlockSettingsProps {
    block: CmsBlock;
    onChange: (updated: CmsBlock) => void;
    onClose: () => void;
}

const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white";
const labelCls = "block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5";
const sectionCls = "space-y-3 pb-5 border-b border-slate-200 dark:border-slate-700/60";

function updateData(block: CmsBlock, key: string, value: any): CmsBlock {
    return { ...block, data: { ...block.data, [key]: value } };
}

function updateStyle(block: CmsBlock, key: keyof CmsBlockStyle, value: any): CmsBlock {
    return { ...block, style: { ...(block.style || {}), [key]: value } };
}

// ═══════════════════════════════════════
// HERO SETTINGS
// ═══════════════════════════════════════
function HeroSettings({ block, onChange }: { block: CmsBlock; onChange: (b: CmsBlock) => void }) {
    const d = block.data;
    return (
        <div className="space-y-4">
            <div>
                <label className={labelCls}>Badge (nhãn nhỏ)</label>
                <input className={inputCls} value={d.badge || ''} onChange={e => onChange(updateData(block, 'badge', e.target.value))} placeholder="VD: Giải pháp số 1" />
            </div>
            <div>
                <label className={labelCls}>Tiêu đề chính *</label>
                <input className={inputCls} value={d.title || ''} onChange={e => onChange(updateData(block, 'title', e.target.value))} placeholder="Tiêu đề Hero lớn" />
            </div>
            <div>
                <label className={labelCls}>Mô tả phụ</label>
                <textarea className={inputCls + ' resize-none h-20'} value={d.subtitle || ''} onChange={e => onChange(updateData(block, 'subtitle', e.target.value))} placeholder="Mô tả ngắn..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>Nút CTA chính</label>
                    <input className={inputCls} value={d.ctaText || ''} onChange={e => onChange(updateData(block, 'ctaText', e.target.value))} placeholder="Bắt đầu miễn phí" />
                </div>
                <div>
                    <label className={labelCls}>URL CTA</label>
                    <input className={inputCls} value={d.ctaUrl || ''} onChange={e => onChange(updateData(block, 'ctaUrl', e.target.value))} placeholder="#/login" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>Nút phụ</label>
                    <input className={inputCls} value={d.secondaryCtaText || ''} onChange={e => onChange(updateData(block, 'secondaryCtaText', e.target.value))} placeholder="Xem Demo" />
                </div>
                <div>
                    <label className={labelCls}>URL phụ</label>
                    <input className={inputCls} value={d.secondaryCtaUrl || ''} onChange={e => onChange(updateData(block, 'secondaryCtaUrl', e.target.value))} placeholder="#/demo" />
                </div>
            </div>
            <div>
                <label className={labelCls}>Ảnh nền (URL)</label>
                <input className={inputCls} value={d.bgImage || ''} onChange={e => onChange(updateData(block, 'bgImage', e.target.value))} placeholder="https://..." />
            </div>
            <div>
                <label className={labelCls}>Căn chỉnh</label>
                <select className={inputCls} value={d.alignment || 'left'} onChange={e => onChange(updateData(block, 'alignment', e.target.value))}>
                    <option value="left">Trái</option>
                    <option value="center">Giữa</option>
                </select>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════
// TEXT SETTINGS (Rich Text)
// ═══════════════════════════════════════
function TextSettings({ block, onChange }: { block: CmsBlock; onChange: (b: CmsBlock) => void }) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
        ],
    };
    return (
        <div>
            <label className={labelCls}>Nội dung văn bản</label>
            <div className="bg-white text-slate-900 border border-slate-300 rounded-xl overflow-hidden [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-sm">
                <ReactQuill
                    theme="snow"
                    value={block.data.html || ''}
                    onChange={(val) => onChange(updateData(block, 'html', val))}
                    modules={modules}
                    placeholder="Nhập nội dung..."
                />
            </div>
        </div>
    );
}

// ═══════════════════════════════════════
// LIST ITEMS EDITOR (shared by features, FAQ, stats, testimonials)
// ═══════════════════════════════════════
function ListItemsEditor({
    items,
    fields,
    onUpdate,
    addLabel,
}: {
    items: any[];
    fields: { key: string; label: string; type?: 'text' | 'textarea'; placeholder?: string }[];
    onUpdate: (newItems: any[]) => void;
    addLabel: string;
}) {
    const addItem = () => {
        const blank: any = {};
        fields.forEach(f => { blank[f.key] = ''; });
        onUpdate([...items, blank]);
    };
    const removeItem = (idx: number) => onUpdate(items.filter((_, i) => i !== idx));
    const editItem = (idx: number, key: string, val: string) => {
        const copy = [...items];
        copy[idx] = { ...copy[idx], [key]: val };
        onUpdate(copy);
    };

    return (
        <div className="space-y-3">
            {items.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/30 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">#{idx + 1}</span>
                        <button type="button" onClick={() => removeItem(idx)} className="p-1 text-slate-400 hover:text-red-500 transition cursor-pointer">
                            <Trash2 size={12} />
                        </button>
                    </div>
                    {fields.map(f => (
                        <div key={f.key}>
                            <label className="text-[10px] font-medium text-slate-500 mb-0.5 block">{f.label}</label>
                            {f.type === 'textarea' ? (
                                <textarea className={inputCls + ' resize-none h-16 text-xs'} value={item[f.key] || ''} onChange={e => editItem(idx, f.key, e.target.value)} placeholder={f.placeholder} />
                            ) : (
                                <input className={inputCls + ' text-xs'} value={item[f.key] || ''} onChange={e => editItem(idx, f.key, e.target.value)} placeholder={f.placeholder} />
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <button type="button" onClick={addItem} className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-400 transition cursor-pointer">
                <Plus size={14} /> {addLabel}
            </button>
        </div>
    );
}

// ═══════════════════════════════════════
// FEATURES SETTINGS
// ═══════════════════════════════════════
function FeaturesSettings({ block, onChange }: { block: CmsBlock; onChange: (b: CmsBlock) => void }) {
    const d = block.data;
    return (
        <div className="space-y-4">
            <div>
                <label className={labelCls}>Tiêu đề section</label>
                <input className={inputCls} value={d.heading || ''} onChange={e => onChange(updateData(block, 'heading', e.target.value))} placeholder="Tại sao chọn chúng tôi?" />
            </div>
            <div>
                <label className={labelCls}>Mô tả phụ</label>
                <input className={inputCls} value={d.subheading || ''} onChange={e => onChange(updateData(block, 'subheading', e.target.value))} placeholder="Mô tả ngắn..." />
            </div>
            <div>
                <label className={labelCls}>Số cột</label>
                <select className={inputCls} value={d.columns || 3} onChange={e => onChange(updateData(block, 'columns', parseInt(e.target.value)))}>
                    <option value={2}>2 cột</option>
                    <option value={3}>3 cột</option>
                    <option value={4}>4 cột</option>
                </select>
            </div>
            <div>
                <label className={labelCls}>Danh sách tính năng</label>
                <ListItemsEditor
                    items={d.items || []}
                    fields={[
                        { key: 'icon', label: 'Icon (emoji/ký tự)', placeholder: '⚡' },
                        { key: 'title', label: 'Tiêu đề', placeholder: 'Tính năng' },
                        { key: 'description', label: 'Mô tả', type: 'textarea', placeholder: 'Chi tiết...' },
                    ]}
                    onUpdate={(items) => onChange(updateData(block, 'items', items))}
                    addLabel="Thêm tính năng"
                />
            </div>
        </div>
    );
}

// ═══════════════════════════════════════
// IMAGE-TEXT SETTINGS
// ═══════════════════════════════════════
function ImageTextSettings({ block, onChange }: { block: CmsBlock; onChange: (b: CmsBlock) => void }) {
    const d = block.data;
    return (
        <div className="space-y-4">
            <div>
                <label className={labelCls}>Badge</label>
                <input className={inputCls} value={d.badge || ''} onChange={e => onChange(updateData(block, 'badge', e.target.value))} placeholder="Tính năng mới" />
            </div>
            <div>
                <label className={labelCls}>Tiêu đề *</label>
                <input className={inputCls} value={d.title || ''} onChange={e => onChange(updateData(block, 'title', e.target.value))} placeholder="Tiêu đề" />
            </div>
            <div>
                <label className={labelCls}>Mô tả</label>
                <textarea className={inputCls + ' resize-none h-20'} value={d.description || ''} onChange={e => onChange(updateData(block, 'description', e.target.value))} placeholder="Chi tiết..." />
            </div>
            <div>
                <label className={labelCls}>URL hình ảnh</label>
                <input className={inputCls} value={d.imageUrl || ''} onChange={e => onChange(updateData(block, 'imageUrl', e.target.value))} placeholder="https://..." />
            </div>
            <div>
                <label className={labelCls}>Vị trí ảnh</label>
                <select className={inputCls} value={d.imagePosition || 'right'} onChange={e => onChange(updateData(block, 'imagePosition', e.target.value))}>
                    <option value="left">Trái</option>
                    <option value="right">Phải</option>
                </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>Nút CTA</label>
                    <input className={inputCls} value={d.ctaText || ''} onChange={e => onChange(updateData(block, 'ctaText', e.target.value))} placeholder="Tìm hiểu thêm" />
                </div>
                <div>
                    <label className={labelCls}>URL CTA</label>
                    <input className={inputCls} value={d.ctaUrl || ''} onChange={e => onChange(updateData(block, 'ctaUrl', e.target.value))} placeholder="#" />
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════
// FAQ SETTINGS
// ═══════════════════════════════════════
function FAQSettings({ block, onChange }: { block: CmsBlock; onChange: (b: CmsBlock) => void }) {
    const d = block.data;
    return (
        <div className="space-y-4">
            <div>
                <label className={labelCls}>Tiêu đề section</label>
                <input className={inputCls} value={d.heading || ''} onChange={e => onChange(updateData(block, 'heading', e.target.value))} placeholder="Câu hỏi thường gặp" />
            </div>
            <div>
                <label className={labelCls}>Mô tả phụ</label>
                <input className={inputCls} value={d.subheading || ''} onChange={e => onChange(updateData(block, 'subheading', e.target.value))} />
            </div>
            <div>
                <label className={labelCls}>Danh sách câu hỏi</label>
                <ListItemsEditor
                    items={d.items || []}
                    fields={[
                        { key: 'question', label: 'Câu hỏi', placeholder: 'Nền tảng có miễn phí không?' },
                        { key: 'answer', label: 'Trả lời', type: 'textarea', placeholder: 'Có, chúng tôi có gói miễn phí...' },
                    ]}
                    onUpdate={(items) => onChange(updateData(block, 'items', items))}
                    addLabel="Thêm câu hỏi"
                />
            </div>
        </div>
    );
}

// ═══════════════════════════════════════
// CTA SETTINGS
// ═══════════════════════════════════════
function CTASettings({ block, onChange }: { block: CmsBlock; onChange: (b: CmsBlock) => void }) {
    const d = block.data;
    return (
        <div className="space-y-4">
            <div>
                <label className={labelCls}>Tiêu đề *</label>
                <input className={inputCls} value={d.title || ''} onChange={e => onChange(updateData(block, 'title', e.target.value))} placeholder="Sẵn sàng bắt đầu?" />
            </div>
            <div>
                <label className={labelCls}>Mô tả</label>
                <textarea className={inputCls + ' resize-none h-16'} value={d.description || ''} onChange={e => onChange(updateData(block, 'description', e.target.value))} placeholder="Đăng ký miễn phí ngay hôm nay..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>Nút CTA</label>
                    <input className={inputCls} value={d.buttonText || ''} onChange={e => onChange(updateData(block, 'buttonText', e.target.value))} placeholder="Bắt đầu ngay" />
                </div>
                <div>
                    <label className={labelCls}>URL</label>
                    <input className={inputCls} value={d.buttonUrl || ''} onChange={e => onChange(updateData(block, 'buttonUrl', e.target.value))} placeholder="#/login" />
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════
// STATS SETTINGS
// ═══════════════════════════════════════
function StatsSettings({ block, onChange }: { block: CmsBlock; onChange: (b: CmsBlock) => void }) {
    const d = block.data;
    return (
        <div className="space-y-4">
            <div>
                <label className={labelCls}>Tiêu đề section</label>
                <input className={inputCls} value={d.heading || ''} onChange={e => onChange(updateData(block, 'heading', e.target.value))} placeholder="Con số ấn tượng" />
            </div>
            <div>
                <label className={labelCls}>Danh sách số liệu</label>
                <ListItemsEditor
                    items={d.items || []}
                    fields={[
                        { key: 'value', label: 'Giá trị', placeholder: '1000' },
                        { key: 'suffix', label: 'Hậu tố', placeholder: '+' },
                        { key: 'label', label: 'Nhãn', placeholder: 'Khách hàng' },
                    ]}
                    onUpdate={(items) => onChange(updateData(block, 'items', items))}
                    addLabel="Thêm số liệu"
                />
            </div>
        </div>
    );
}

// ═══════════════════════════════════════
// DIVIDER SETTINGS
// ═══════════════════════════════════════
function DividerSettings({ block, onChange }: { block: CmsBlock; onChange: (b: CmsBlock) => void }) {
    const d = block.data;
    return (
        <div className="space-y-4">
            <div>
                <label className={labelCls}>Chiều cao (px)</label>
                <input type="number" className={inputCls} value={d.height || 48} onChange={e => onChange(updateData(block, 'height', parseInt(e.target.value) || 48))} />
            </div>
            <div>
                <label className={labelCls}>Kiểu</label>
                <select className={inputCls} value={d.style || 'line'} onChange={e => onChange(updateData(block, 'style', e.target.value))}>
                    <option value="line">Đường kẻ</option>
                    <option value="space">Khoảng trống</option>
                    <option value="dots">Chấm tròn</option>
                </select>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════
// TESTIMONIALS SETTINGS
// ═══════════════════════════════════════
function TestimonialsSettings({ block, onChange }: { block: CmsBlock; onChange: (b: CmsBlock) => void }) {
    const d = block.data;
    return (
        <div className="space-y-4">
            <div>
                <label className={labelCls}>Tiêu đề section</label>
                <input className={inputCls} value={d.heading || ''} onChange={e => onChange(updateData(block, 'heading', e.target.value))} placeholder="Khách hàng nói gì?" />
            </div>
            <div>
                <label className={labelCls}>Danh sách đánh giá</label>
                <ListItemsEditor
                    items={d.items || []}
                    fields={[
                        { key: 'quote', label: 'Nhận xét', type: 'textarea', placeholder: 'Dịch vụ rất tuyệt vời...' },
                        { key: 'author', label: 'Tên', placeholder: 'Nguyễn Văn A' },
                        { key: 'role', label: 'Chức vụ', placeholder: 'Chủ nhà trọ' },
                    ]}
                    onUpdate={(items) => onChange(updateData(block, 'items', items))}
                    addLabel="Thêm đánh giá"
                />
            </div>
        </div>
    );
}

// ═══════════════════════════════════════
// GALLERY SETTINGS
// ═══════════════════════════════════════
function GallerySettings({ block, onChange }: { block: CmsBlock; onChange: (b: CmsBlock) => void }) {
    const d = block.data;
    return (
        <div className="space-y-4">
            <div>
                <label className={labelCls}>Tiêu đề section</label>
                <input className={inputCls} value={d.heading || ''} onChange={e => onChange(updateData(block, 'heading', e.target.value))} placeholder="Thư viện ảnh" />
            </div>
            <div>
                <label className={labelCls}>Số cột</label>
                <select className={inputCls} value={d.columns || 3} onChange={e => onChange(updateData(block, 'columns', parseInt(e.target.value)))}>
                    <option value={2}>2 cột</option>
                    <option value={3}>3 cột</option>
                    <option value={4}>4 cột</option>
                </select>
            </div>
            <div>
                <label className={labelCls}>Danh sách ảnh</label>
                <ListItemsEditor
                    items={d.images || []}
                    fields={[
                        { key: 'url', label: 'URL ảnh', placeholder: 'https://...' },
                        { key: 'caption', label: 'Chú thích', placeholder: '' },
                    ]}
                    onUpdate={(images) => onChange(updateData(block, 'images', images))}
                    addLabel="Thêm ảnh"
                />
            </div>
        </div>
    );
}

// ═══════════════════════════════════════
// STYLE SETTINGS (shared across all blocks)
// ═══════════════════════════════════════
function StyleSettings({ block, onChange }: { block: CmsBlock; onChange: (b: CmsBlock) => void }) {
    const s = block.style || {};
    return (
        <div className={sectionCls}>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kiểu dáng</h4>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>Padding</label>
                    <select className={inputCls} value={s.padding || 'lg'} onChange={e => onChange(updateStyle(block, 'padding', e.target.value as any))}>
                        <option value="none">Không</option>
                        <option value="sm">Nhỏ</option>
                        <option value="md">Vừa</option>
                        <option value="lg">Lớn</option>
                        <option value="xl">Rất lớn</option>
                    </select>
                </div>
                <div>
                    <label className={labelCls}>Chiều rộng</label>
                    <select className={inputCls} value={s.maxWidth || 'lg'} onChange={e => onChange(updateStyle(block, 'maxWidth', e.target.value as any))}>
                        <option value="sm">Hẹp</option>
                        <option value="md">Vừa</option>
                        <option value="lg">Rộng</option>
                        <option value="xl">Rất rộng</option>
                        <option value="full">Toàn bộ</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>Màu nền</label>
                    <input type="color" className="w-full h-8 rounded-lg cursor-pointer" value={s.bgColor || '#060b17'} onChange={e => onChange(updateStyle(block, 'bgColor', e.target.value))} />
                </div>
                <div>
                    <label className={labelCls}>Overlay tối</label>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-blue-600" checked={s.darkOverlay || false} onChange={e => onChange(updateStyle(block, 'darkOverlay', e.target.checked))} />
                        <span className="text-xs text-slate-500">Bật</span>
                    </label>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════
// MAIN: BLOCK SETTINGS
// ═══════════════════════════════════════
const SETTINGS_MAP: Record<string, React.FC<{ block: CmsBlock; onChange: (b: CmsBlock) => void }>> = {
    hero: HeroSettings,
    text: TextSettings,
    features: FeaturesSettings,
    'image-text': ImageTextSettings,
    faq: FAQSettings,
    cta: CTASettings,
    stats: StatsSettings,
    divider: DividerSettings,
    testimonials: TestimonialsSettings,
    gallery: GallerySettings,
};

const TYPE_LABELS: Record<string, string> = {
    hero: 'Hero Banner',
    text: 'Văn bản',
    features: 'Tính năng',
    'image-text': 'Ảnh + Văn bản',
    faq: 'FAQ',
    cta: 'Call to Action',
    stats: 'Thống kê',
    divider: 'Phân cách',
    testimonials: 'Đánh giá',
    gallery: 'Thư viện ảnh',
};

export default function BlockSettings({ block, onChange, onClose }: BlockSettingsProps) {
    const Comp = SETTINGS_MAP[block.type];

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {TYPE_LABELS[block.type] || block.type}
                </h3>
                <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <StyleSettings block={block} onChange={onChange} />

            {Comp ? (
                <Comp block={block} onChange={onChange} />
            ) : (
                <p className="text-sm text-slate-500">Không có cài đặt cho block này.</p>
            )}
        </div>
    );
}
