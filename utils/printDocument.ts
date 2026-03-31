interface PrintDocumentOptions {
    title?: string;
    autoPrint?: boolean;
}

function applyDocumentTitle(html: string, title?: string) {
    if (!title) return html;

    if (/<title>.*<\/title>/i.test(html)) {
        return html.replace(/<title>.*<\/title>/i, `<title>${title}</title>`);
    }

    if (/<head>/i.test(html)) {
        return html.replace(/<head>/i, `<head><title>${title}</title>`);
    }

    return html;
}

function fallbackOpenWindow(html: string, options: PrintDocumentOptions) {
    const popup = window.open('', '_blank', 'noopener,noreferrer,width=1080,height=900');
    if (!popup) {
        alert('Trình duyệt đang chặn cửa sổ in. Hãy cho phép popup hoặc thử lại trên tab khác.');
        return;
    }

    popup.document.open();
    popup.document.write(applyDocumentTitle(html, options.title));
    popup.document.close();
    popup.focus();

    if (options.autoPrint !== false) {
        window.setTimeout(() => popup.print(), 250);
    }
}

export function openPrintDocument(html: string, options: PrintDocumentOptions = {}): void {
    const printableHtml = applyDocumentTitle(html, options.title);
    const iframe = document.createElement('iframe');

    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.border = '0';

    const cleanup = () => {
        window.setTimeout(() => {
            iframe.remove();
        }, 1200);
    };

    iframe.onload = () => {
        const frameWindow = iframe.contentWindow;
        if (!frameWindow) {
            cleanup();
            fallbackOpenWindow(printableHtml, options);
            return;
        }

        const handleAfterPrint = () => {
            frameWindow.removeEventListener('afterprint', handleAfterPrint);
            cleanup();
        };

        frameWindow.addEventListener('afterprint', handleAfterPrint);
        frameWindow.focus();

        if (options.autoPrint !== false) {
            window.setTimeout(() => {
                try {
                    frameWindow.print();
                } catch (error) {
                    console.error('Iframe print failed, fallback to popup window', error);
                    cleanup();
                    fallbackOpenWindow(printableHtml, options);
                }
            }, 150);
        } else {
            cleanup();
        }
    };

    document.body.appendChild(iframe);
    iframe.srcdoc = printableHtml;
}
