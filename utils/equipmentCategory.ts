const CATEGORY_PREFIX = '[[category:';

const KEYWORD_CATEGORIES: Array<{ category: string; keywords: string[] }> = [
    { category: 'Điều hòa', keywords: ['điều hòa', 'may lanh', 'máy lạnh', 'air conditioner'] },
    { category: 'Giường tủ', keywords: ['giường', 'tủ', 'wardrobe', 'bed'] },
    { category: 'Thiết bị điện', keywords: ['đèn', 'ổ cắm', 'aptomat', 'điện', 'switch', 'socket'] },
    { category: 'Thiết bị nước', keywords: ['bồn', 'vòi', 'lavabo', 'sen', 'nước', 'toilet'] },
    { category: 'Nhà bếp', keywords: ['bếp', 'tủ bếp', 'máy hút', 'cook', 'kitchen'] },
    { category: 'Điện tử', keywords: ['tivi', 'tv', 'tủ lạnh', 'máy giặt', 'loa', 'fridge', 'washer'] },
    { category: 'An ninh', keywords: ['camera', 'khóa', 'chuông', 'cửa từ', 'security'] },
];

function normalizeText(value?: string): string {
    return (value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

export function inferEquipmentCategory(name?: string): string {
    const normalized = normalizeText(name);
    if (!normalized) return 'Khác';

    for (const entry of KEYWORD_CATEGORIES) {
        if (entry.keywords.some(keyword => normalized.includes(normalizeText(keyword)))) {
            return entry.category;
        }
    }

    return 'Khác';
}

export function extractEquipmentCategory(notes?: string, name?: string): { category: string; notes: string } {
    const rawNotes = notes || '';
    if (rawNotes.startsWith(CATEGORY_PREFIX)) {
        const closingIndex = rawNotes.indexOf(']]');
        if (closingIndex > -1) {
            const category = rawNotes.slice(CATEGORY_PREFIX.length, closingIndex).trim() || inferEquipmentCategory(name);
            const cleanNotes = rawNotes.slice(closingIndex + 2).trimStart();
            return { category, notes: cleanNotes };
        }
    }

    return {
        category: inferEquipmentCategory(name),
        notes: rawNotes,
    };
}

export function composeEquipmentNotes(category: string, notes?: string): string {
    const trimmedCategory = (category || 'Khác').trim();
    const trimmedNotes = (notes || '').trim();
    return `${CATEGORY_PREFIX}${trimmedCategory}]]${trimmedNotes ? `\n${trimmedNotes}` : ''}`;
}
