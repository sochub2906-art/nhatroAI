import React from 'react';
import { Camera, QrCode, Upload, X } from 'lucide-react';

interface Props {
    onClose: () => void;
    onDetect: (rawValue: string) => void;
}

type BarcodeDetectorLike = {
    detect: (source: CanvasImageSource) => Promise<Array<{ rawValue?: string }>>;
};

export default function CCCDScannerModal({ onClose, onDetect }: Props) {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const streamRef = React.useRef<MediaStream | null>(null);
    const frameRef = React.useRef<number | null>(null);
    const detectorRef = React.useRef<BarcodeDetectorLike | null>(null);

    const [error, setError] = React.useState('');
    const [manualValue, setManualValue] = React.useState('');
    const [isCameraReady, setIsCameraReady] = React.useState(false);

    const stopCamera = React.useCallback(() => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        frameRef.current = null;

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    const handleDetected = React.useCallback((value: string) => {
        if (!value) return;
        stopCamera();
        onDetect(value);
        onClose();
    }, [onClose, onDetect, stopCamera]);

    const scanFrame = React.useCallback(async () => {
        const video = videoRef.current;
        const detector = detectorRef.current;
        if (!video || !detector || video.readyState < 2) {
            frameRef.current = requestAnimationFrame(scanFrame);
            return;
        }

        try {
            const codes = await detector.detect(video);
            const rawValue = codes.find(code => code.rawValue)?.rawValue;
            if (rawValue) {
                handleDetected(rawValue);
                return;
            }
        } catch (scanError) {
            setError(scanError instanceof Error ? scanError.message : 'Không thể quét mã QR.');
        }

        frameRef.current = requestAnimationFrame(scanFrame);
    }, [handleDetected]);

    React.useEffect(() => {
        let active = true;

        const start = async () => {
            const BarcodeDetectorCtor = (window as any).BarcodeDetector;
            if (!BarcodeDetectorCtor || !navigator.mediaDevices?.getUserMedia) {
                setError('Thiết bị chưa hỗ trợ quét QR trực tiếp. Bạn có thể tải ảnh hoặc dán chuỗi QR.');
                return;
            }

            try {
                detectorRef.current = new BarcodeDetectorCtor({ formats: ['qr_code'] });
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: 'environment' },
                    },
                    audio: false,
                });
                if (!active) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
                setIsCameraReady(true);
                frameRef.current = requestAnimationFrame(scanFrame);
            } catch (cameraError) {
                setError(cameraError instanceof Error ? cameraError.message : 'Không thể mở camera.');
            }
        };

        start();
        return () => {
            active = false;
            stopCamera();
        };
    }, [scanFrame, stopCamera]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const BarcodeDetectorCtor = (window as any).BarcodeDetector;
            if (!BarcodeDetectorCtor) {
                setError('Trình duyệt chưa hỗ trợ đọc QR từ ảnh.');
                return;
            }

            const detector: BarcodeDetectorLike = detectorRef.current || new BarcodeDetectorCtor({ formats: ['qr_code'] });
            const bitmap = await createImageBitmap(file);
            const results = await detector.detect(bitmap);
            const rawValue = results.find(result => result.rawValue)?.rawValue;
            if (!rawValue) {
                setError('Không đọc được mã QR từ ảnh đã chọn.');
                return;
            }
            handleDetected(rawValue);
        } catch (fileError) {
            setError(fileError instanceof Error ? fileError.message : 'Không thể phân tích ảnh.');
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quét QR CCCD</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Ưu tiên camera sau, có thể thay bằng ảnh hoặc chuỗi QR.</p>
                    </div>
                    <button
                        onClick={() => {
                            stopCamera();
                            onClose();
                        }}
                        className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 p-5">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 dark:border-slate-700">
                        <div className="relative aspect-[4/3] w-full">
                            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="h-44 w-72 rounded-3xl border-2 border-dashed border-white/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.35)]" />
                            </div>
                            {!isCameraReady && (
                                <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-white">
                                    <Camera className="h-4 w-4" />
                                    Đang khởi động camera...
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-slate-800">
                            <Upload className="h-4 w-4" />
                            Chọn ảnh QR
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>

                        <button
                            type="button"
                            onClick={() => handleDetected(manualValue)}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <QrCode className="h-4 w-4" />
                            Dùng chuỗi QR đã dán
                        </button>
                    </div>

                    <textarea
                        value={manualValue}
                        onChange={event => setManualValue(event.target.value)}
                        rows={4}
                        placeholder="Nếu app camera khác đã quét CCCD, dán chuỗi QR vào đây."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-950"
                    />
                </div>
            </div>
        </div>
    );
}
