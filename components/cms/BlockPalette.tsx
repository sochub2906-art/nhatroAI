/**
 * ═══════════════════════════════════════════════════
 * CMS Block Palette — Block type selector for admin
 * ═══════════════════════════════════════════════════
 */
import React from 'react';
import {
    Layout, Type, Grid3X3, PanelLeft, HelpCircle,
    Megaphone, BarChart3, Minus, Quote, Images
} from 'lucide-react';
import { CMS_BLOCK_META, CmsBlockType } from '../../types';

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
    'layout': Layout,
    'type': Type,
    'grid-3x3': Grid3X3,
    'panel-left': PanelLeft,
    'help-circle': HelpCircle,
    'megaphone': Megaphone,
    'bar-chart-3': BarChart3,
    'minus': Minus,
    'quote': Quote,
    'images': Images,
};

interface BlockPaletteProps {
    onAddBlock: (type: CmsBlockType) => void;
}

export default function BlockPalette({ onAddBlock }: BlockPaletteProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                Thêm Block
            </h3>
            <div className="grid grid-cols-2 gap-2">
                {CMS_BLOCK_META.map((meta) => {
                    const IconComp = ICON_MAP[meta.icon];
                    return (
                        <button
                            key={meta.type}
                            type="button"
                            onClick={() => onAddBlock(meta.type)}
                            className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-3 text-center transition-all hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-sm cursor-pointer group"
                        >
                            {IconComp && <IconComp size={20} className="text-slate-400 group-hover:text-blue-500 transition-colors" />}
                            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-tight">
                                {meta.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
