/**
 * Client-side image compression.
 * Resizes large images and re-encodes as JPEG until < target size.
 * Returns base64 data URL or null on failure. Completely silent.
 */

const MAX_DIMENSION = 1600;
const DEFAULT_MAX_KB = 900;
const QUALITY_STEPS = [0.85, 0.7, 0.55, 0.4, 0.3, 0.2];

function loadImageFromFile(file: File): Promise<HTMLImageElement | null> {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = reader.result as string;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });
}

function resizeAndEncode(img: HTMLImageElement, quality: number): string {
    const canvas = document.createElement('canvas');
    let { width, height } = img;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', quality);
}

function getBase64SizeKB(dataUrl: string): number {
    const base64 = dataUrl.split(',')[1] || '';
    return Math.round((base64.length * 3) / 4 / 1024);
}

/**
 * Compress an image file to a base64 data URL under the target size.
 * @returns base64 data URL string, or null if compression fails.
 */
export async function compressImageFile(file: File, maxKB: number = DEFAULT_MAX_KB): Promise<string | null> {
    try {
        if (!file.type.startsWith('image/')) return null;

        const img = await loadImageFromFile(file);
        if (!img) return null;

        for (const quality of QUALITY_STEPS) {
            const dataUrl = resizeAndEncode(img, quality);
            if (!dataUrl) continue;

            if (getBase64SizeKB(dataUrl) <= maxKB) {
                return dataUrl;
            }
        }

        // Last resort: smallest quality
        const lastAttempt = resizeAndEncode(img, 0.1);
        return lastAttempt || null;
    } catch {
        return null;
    }
}
