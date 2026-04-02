/**
 * ═══════════════════════════════════════════════════
 * CMS Block Canvas — Live preview with controls
 * ═══════════════════════════════════════════════════
 */
import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Settings, GripVertical, Plus } from 'lucide-react';
import type { CmsBlock } from '../../types';
import BlockRenderer from './BlockRenderer';

interface BlockCanvasProps {
    blocks: CmsBlock[];
    selectedBlockId: string | null;
    onSelectBlock: (id: string | null) => void;
    onMoveBlock: (id: string, direction: 'up' | 'down') => void;
    onDeleteBlock: (id: string) => void;
    onAddBlockAt?: (index: number) => void;
}

export default function BlockCanvas({
    blocks,
    selectedBlockId,
    onSelectBlock,
    onMoveBlock,
    onDeleteBlock,
}: BlockCanvasProps) {
    if (blocks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                <div className="text-center space-y-3">
                    <Plus size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Chưa có block nào</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                        Chọn block từ menu bên trái để bắt đầu xây dựng trang
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-0">
            {blocks.map((block, idx) => {
                const isSelected = selectedBlockId === block.id;
                return (
                    <div
                        key={block.id}
                        className={`relative group transition-all ${isSelected ? 'ring-2 ring-blue-500 rounded-xl z-10' : 'hover:ring-1 hover:ring-blue-500/30 rounded-xl'}`}
                    >
                        {/* Block Toolbar */}
                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 rounded-full border bg-white dark:bg-slate-800 shadow-lg px-2 py-1 transition-all ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'}`}
                            style={{ borderColor: isSelected ? 'rgb(59 130 246)' : 'rgb(226 232 240)' }}
                        >
                            <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 dark:border-slate-700 mr-1">
                                <GripVertical size={12} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    {block.type}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onMoveBlock(block.id, 'up'); }}
                                disabled={idx === 0}
                                className="p-1 rounded-md text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                title="Di chuyển lên"
                            >
                                <ArrowUp size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onMoveBlock(block.id, 'down'); }}
                                disabled={idx === blocks.length - 1}
                                className="p-1 rounded-md text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                title="Di chuyển xuống"
                            >
                                <ArrowDown size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onSelectBlock(block.id); }}
                                className="p-1 rounded-md text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer"
                                title="Cài đặt block"
                            >
                                <Settings size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onDeleteBlock(block.id); }}
                                className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition cursor-pointer"
                                title="Xóa block"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        {/* Block Preview */}
                        <div
                            onClick={() => onSelectBlock(isSelected ? null : block.id)}
                            className="cursor-pointer"
                        >
                            {/* Mini preview container with dark background */}
                            <div className="bg-[#060b17] text-white rounded-xl overflow-hidden">
                                <BlockRenderer
                                    blocks={[block]}
                                    isEditor={false}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
