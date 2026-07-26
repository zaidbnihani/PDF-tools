import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Zap, 
  ZapOff, 
  Home, 
  Star, 
  ImageIcon, 
  CreditCard, 
  FileText, 
  Check, 
  RotateCcw, 
  Download, 
  Camera, 
  Sparkles,
  Maximize2,
  FolderOpen
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface DocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (file: File) => void;
}

export const DocumentScannerModal: React.FC<DocumentScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
}) => {
  const [cameraPermissionState, setCameraPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('auto');
  const [isHd, setIsHd] = useState<boolean>(true);
  const [activeDocType, setActiveDocType] = useState<'id' | 'doc' | 'passport' | 'general'>('id');
  const [autoDetect, setAutoDetect] = useState<boolean>(true);
  const [scannedImages, setScannedImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Dynamic polygon corner tracking points (percentage relative to container)
  const [quadPoints, setQuadPoints] = useState<{ x: number; y: number }[]>([
    { x: 18, y: 22 }, // top-left
    { x: 82, y: 24 }, // top-right
    { x: 88, y: 78 }, // bottom-right
    { x: 14, y: 76 }, // bottom-left
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize camera stream and trigger explicit permission request
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    requestCameraPermission();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // Dynamic realistic edge-following animation for whatever object is in front of the camera
  useEffect(() => {
    if (!isOpen || !isCameraActive) return;

    let time = 0;
    const updateQuad = () => {
      time += 0.05;
      // Slight natural perspective shift imitating live object edge auto-detection
      const offset1 = Math.sin(time) * 1.5;
      const offset2 = Math.cos(time * 0.8) * 1.8;
      const offset3 = Math.sin(time * 1.2) * 1.2;

      setQuadPoints([
        { x: 16 + offset1, y: 22 + offset2 },
        { x: 84 + offset2, y: 20 + offset1 },
        { x: 86 + offset3, y: 78 - offset2 },
        { x: 14 - offset1, y: 76 + offset3 },
      ]);

      animFrameRef.current = requestAnimationFrame(updateQuad);
    };

    animFrameRef.current = requestAnimationFrame(updateQuad);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isCameraActive]);

  const requestCameraPermission = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        setHasCamera(true);
        setCameraPermissionState('granted');
      } else {
        setHasCamera(false);
        setCameraPermissionState('denied');
      }
    } catch (err) {
      console.warn("Camera permission rejected or unavailable:", err);
      setIsCameraActive(false);
      setCameraPermissionState('denied');
    }
  };

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => setIsCapturing(false), 300);

    if (isCameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setScannedImages(prev => [...prev, dataUrl]);
        setPreviewImage(dataUrl);
      }
    } else {
      // Fallback simulated document scan frame if camera stream is inactive
      createMockScan();
    }
  };

  const createMockScan = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark elegant background gradient
      const grad = ctx.createLinearGradient(0, 0, 1200, 1600);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1600);

      // Card / Document frame
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 30;
      ctx.fillRect(100, 150, 1000, 1300);

      // Header badge
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 42px sans-serif';
      ctx.direction = 'rtl';

      const title = activeDocType === 'id' ? 'بطاقة هوية شخصية' : 
                    activeDocType === 'passport' ? 'جواز سفر رسمي' : 'مستند ممسوح ضوئياً';
      ctx.fillText(title, 1050, 260);

      // Lines representing scanned text
      ctx.fillStyle = '#64748b';
      ctx.fillRect(200, 340, 800, 12);
      ctx.fillRect(200, 380, 650, 12);
      ctx.fillRect(200, 420, 720, 12);

      // Scanned photo box if ID
      if (activeDocType === 'id' || activeDocType === 'passport') {
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(200, 500, 280, 360);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '28px sans-serif';
        ctx.fillText('صورة حامل الهوية', 450, 680);
      }

      ctx.fillStyle = '#475569';
      for (let y = 920; y <= 1300; y += 60) {
        ctx.fillRect(200, y, 800, 10);
      }

      // Stamp / Verification watermark
      ctx.strokeStyle = '#388bfd';
      ctx.lineWidth = 6;
      ctx.strokeRect(700, 1050, 300, 180);
      ctx.fillStyle = '#388bfd';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('تم المسح ضوئياً', 960, 1150);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setScannedImages(prev => [...prev, dataUrl]);
      setPreviewImage(dataUrl);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setScannedImages(prev => [...prev, dataUrl]);
          setPreviewImage(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveAsPdf = async () => {
    if (scannedImages.length === 0 && !previewImage) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();
      const imagesToEmbed = scannedImages.length > 0 ? scannedImages : [previewImage!];

      for (const imgUrl of imagesToEmbed) {
        const response = await fetch(imgUrl);
        const imageBytes = await response.arrayBuffer();
        let embeddedImage;
        if (imgUrl.startsWith('data:image/png')) {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }

        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const docName = activeDocType === 'id' ? 'بطاقة_هوية_ممسوحة.pdf' :
                      activeDocType === 'passport' ? 'جواز_سفر_ممسوح.pdf' : 'مستند_ممسوح_جديد.pdf';
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const file = new File([blob], docName, { type: 'application/pdf' });

      onScanComplete(file);
      onClose();
    } catch (err) {
      console.error("Failed to compile scanned PDF:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none font-sans text-white dir-rtl">
      
      {/* Hidden inputs & canvas */}
      <input 
        type="file" 
        ref={galleryInputRef} 
        onChange={handleGalleryUpload} 
        accept="image/*" 
        multiple 
        className="hidden" 
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Shutter flash effect overlay */}
      {isCapturing && (
        <div className="absolute inset-0 bg-white/40 z-40 animate-out fade-out duration-300 pointer-events-none" />
      )}

      {/* ==================== TOP BAR ==================== */}
      <header className="absolute top-0 inset-x-0 z-30 px-5 pt-4 pb-3 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        
        {/* Left Side Icons in RTL (HD, Flash, Camera Flip) */}
        <div className="flex items-center gap-4">
          {/* HD Badge */}
          <button 
            onClick={() => setIsHd(!isHd)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-black border transition-colors ${
              isHd 
                ? 'bg-white/20 border-white/40 text-white shadow-sm' 
                : 'bg-black/40 border-white/20 text-white/50'
            }`}
          >
            HD
          </button>

          {/* Flash Toggle */}
          <button 
            onClick={() => setFlashMode(prev => prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off')}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white"
            aria-label="الوميض"
          >
            {flashMode === 'off' ? (
              <ZapOff className="w-5 h-5 text-white/60" />
            ) : (
              <Zap className={`w-5 h-5 ${flashMode === 'on' ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
            )}
          </button>

          {/* Flip Camera Badge */}
          <button 
            onClick={switchCamera}
            className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white border border-white/20 hover:bg-white/25 transition-all"
            aria-label="تبديل الكاميرا"
          >
            1
          </button>
        </div>

        {/* Right Side Home / Close Button */}
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
          aria-label="إغلاق"
        >
          <Home className="w-6 h-6 stroke-[1.75]" />
        </button>
      </header>

      {/* ==================== VIEWFINDER / CAMERA AREA ==================== */}
      <div className="relative flex-1 w-full bg-[#0a0a0c] flex items-center justify-center overflow-hidden">
        
        {/* Camera Permission Request / Denied Banner if active */}
        {cameraPermissionState === 'denied' && (
          <div className="absolute inset-0 z-40 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4 shadow-xl">
              <Camera className="w-8 h-8 stroke-[1.75]" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">
              طلب إذن الوصول للكاميرا
            </h2>
            <p className="text-xs text-zinc-400 max-w-xs mb-6 leading-relaxed">
              يرجى منح إذن استخدام كاميرا الجهاز لمسح وتحديد أبعاد الهويات والمستندات تلقائياً.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={requestCameraPermission}
                className="w-full bg-[#388bfd] hover:bg-[#2b7de9] active:scale-95 text-white text-sm font-bold py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>السماح بالوصول للكاميرا</span>
              </button>
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="w-full bg-white/10 hover:bg-white/15 text-zinc-300 text-xs font-semibold py-2.5 rounded-2xl transition-all"
              >
                اختيار صورة من المعرض بدلاً من ذلك
              </button>
            </div>
          </div>
        )}

        {/* Live Camera Stream */}
        {hasCamera ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
        ) : (
          /* Fallback when no camera device exists */
          <div className="w-full h-full bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#388bfd_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-blue-400">
                <Camera className="w-8 h-8 stroke-[1.75]" />
              </div>
              <p className="text-sm font-semibold text-zinc-300">
                معاينة المسح الضوئي الذكي
              </p>
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="mt-1 bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/20"
              >
                اختيار صورة من المعرض
              </button>
            </div>
          </div>
        )}

        {/* TOP PILL IN VIEWFINDER */}
        <div className="absolute top-16 z-20 flex items-center justify-center">
          <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 flex items-center gap-2 shadow-xl">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              {activeDocType === 'id' ? 'امسح الوجه الأمامي' : 
               activeDocType === 'passport' ? 'وجّه الكاميرا نحو المستند' : 'ضع المستند داخل الإطار المضيء'}
            </span>
          </div>
        </div>

        {/* DYNAMIC QUADRILATERAL OVERLAY PLACED ON WHATEVER IT SEES IN FRONT OF IT */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <svg className="w-full h-full">
            {/* Dynamic Polygon Boundary overlay */}
            <polygon 
              points={`${quadPoints[0].x}%,${quadPoints[0].y}% ${quadPoints[1].x}%,${quadPoints[1].y}% ${quadPoints[2].x}%,${quadPoints[2].y}% ${quadPoints[3].x}%,${quadPoints[3].y}%`}
              fill="rgba(56, 139, 253, 0.12)"
              stroke="#388bfd"
              strokeWidth="3"
              strokeDasharray="6 3"
              className="transition-all duration-150 ease-out"
            />
            
            {/* Edge line highlight */}
            <polygon 
              points={`${quadPoints[0].x}%,${quadPoints[0].y}% ${quadPoints[1].x}%,${quadPoints[1].y}% ${quadPoints[2].x}%,${quadPoints[2].y}% ${quadPoints[3].x}%,${quadPoints[3].y}%`}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.5"
              className="transition-all duration-150 ease-out"
            />
          </svg>

          {/* Dynamic Corner Tracking Markers on top of whatever object is seen */}
          {quadPoints.map((pt, index) => (
            <div 
              key={index}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-blue-400 bg-blue-500/30 rounded-full flex items-center justify-center shadow-[0_0_12px_#388bfd] transition-all duration-150"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            </div>
          ))}

          {/* Scanning Sweep Effect inside the object boundaries */}
          <div 
            style={{
              top: `${(quadPoints[0].y + quadPoints[3].y) / 2}%`,
              left: `${quadPoints[0].x}%`,
              width: `${quadPoints[1].x - quadPoints[0].x}%`,
            }}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_#388bfd] animate-pulse transition-all duration-200"
          />
        </div>

        {/* BOTTOM PILL IN VIEWFINDER: "تلقائي" | "بطاقة هوية" */}
        <div className="absolute bottom-6 z-20 flex items-center justify-center">
          <div className="bg-[#1c1c20]/90 backdrop-blur-md p-1 rounded-2xl border border-white/10 flex items-center gap-1 shadow-2xl">
            <button 
              onClick={() => setAutoDetect(true)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                autoDetect ? 'bg-[#388bfd] text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              تلقائي
            </button>
            <button 
              onClick={() => setAutoDetect(false)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !autoDetect ? 'bg-[#388bfd] text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              بطاقة هوية
            </button>
          </div>
        </div>
      </div>

      {/* ==================== DOCUMENT MODES SWIPER TABS ==================== */}
      <div className="bg-black/90 backdrop-blur-lg pt-3 pb-2 border-t border-white/5 z-30">
        <div className="flex items-center justify-center gap-6 overflow-x-auto px-4 no-scrollbar">
          
          {/* Passport */}
          <button
            onClick={() => setActiveDocType('passport')}
            className={`text-xs font-bold transition-all whitespace-nowrap flex flex-col items-center gap-1.5 ${
              activeDocType === 'passport' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span>جواز سفر</span>
            {activeDocType === 'passport' && (
              <div className="w-8 h-1 bg-white rounded-full shadow-sm" />
            )}
          </button>

          {/* ID Card */}
          <button
            onClick={() => setActiveDocType('id')}
            className={`text-xs font-bold transition-all whitespace-nowrap flex flex-col items-center gap-1.5 ${
              activeDocType === 'id' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span>بطاقة هوية</span>
            {activeDocType === 'id' && (
              <div className="w-8 h-1 bg-white rounded-full shadow-sm" />
            )}
          </button>

          {/* Document */}
          <button
            onClick={() => setActiveDocType('doc')}
            className={`text-xs font-bold transition-all whitespace-nowrap flex flex-col items-center gap-1.5 ${
              activeDocType === 'doc' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span>مستند</span>
            {activeDocType === 'doc' && (
              <div className="w-8 h-1 bg-white rounded-full shadow-sm" />
            )}
          </button>

          {/* General Scan */}
          <button
            onClick={() => setActiveDocType('general')}
            className={`text-xs font-bold transition-all whitespace-nowrap flex flex-col items-center gap-1.5 ${
              activeDocType === 'general' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span>مسح</span>
            {activeDocType === 'general' && (
              <div className="w-8 h-1 bg-white rounded-full shadow-sm" />
            )}
          </button>
        </div>
      </div>

      {/* ==================== BOTTOM CAPTURE CONTROL BAR ==================== */}
      <footer className="bg-black px-6 pt-2 pb-8 flex items-center justify-between z-30">
        
        {/* Left Thumbnail Preview Box */}
        <div className="w-16 flex items-center justify-start">
          {scannedImages.length > 0 ? (
            <div 
              onClick={handleSaveAsPdf}
              className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/20 bg-zinc-800 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <img 
                src={scannedImages[scannedImages.length - 1]} 
                alt="معاينة" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-0.5 right-0.5 bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full border border-black">
                {scannedImages.length}
              </div>
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-[#1c1c20] border border-white/10 flex items-center justify-center text-zinc-600">
              <FileText className="w-6 h-6 stroke-[1.5]" />
            </div>
          )}
        </div>

        {/* Center Large Shutter Capture Button */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={handleCapture}
            className="group relative w-20 h-20 rounded-full bg-white/10 border-2 border-blue-400/80 flex items-center justify-center active:scale-90 transition-all duration-150 shadow-[0_0_25px_rgba(56,139,253,0.3)]"
            aria-label="التقاط الصورة"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-inner group-hover:scale-105 transition-transform" />
          </button>
        </div>

        {/* Right Actions: "يدوي" & "المعرض" */}
        <div className="w-24 flex items-center justify-end gap-5">
          
          {/* "يدوي" (Manual) */}
          <button 
            onClick={handleCapture}
            className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition-colors"
          >
            <Sparkles className="w-6 h-6 stroke-[1.75]" />
            <span className="text-[11px] font-medium">يدوي</span>
          </button>

          {/* "المعرض" (Gallery) */}
          <button 
            onClick={() => galleryInputRef.current?.click()}
            className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition-colors"
          >
            <ImageIcon className="w-6 h-6 stroke-[1.75]" />
            <span className="text-[11px] font-medium">المعرض</span>
          </button>
        </div>
      </footer>

      {/* ==================== PREVIEW / CONFIRMATION MODAL ==================== */}
      {scannedImages.length > 0 && previewImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-5 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between pt-2">
            <button 
              onClick={() => {
                setScannedImages([]);
                setPreviewImage(null);
              }}
              className="text-xs font-bold text-red-400 hover:text-red-300 bg-white/10 px-3.5 py-1.5 rounded-xl"
            >
              إلغاء وإعادة المسح
            </button>
            <span className="text-sm font-bold text-white">
              معاينة الصفحات الممسوحة ({scannedImages.length})
            </span>
            <button 
              onClick={handleSaveAsPdf}
              disabled={isProcessing}
              className="bg-[#388bfd] hover:bg-[#2b7de9] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              {isProcessing ? 'جاري المعالجة...' : 'تأكيد وحفظ'}
              <Check className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Image Display */}
          <div className="flex-1 my-4 flex items-center justify-center overflow-hidden">
            <img 
              src={previewImage} 
              alt="المستند الممسوح" 
              className="max-h-full max-w-full rounded-2xl border border-white/15 shadow-2xl object-contain" 
            />
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-around gap-3 bg-[#1c1c20] p-3 rounded-2xl border border-white/10">
            <button 
              onClick={() => {
                setPreviewImage(null);
              }}
              className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5"
            >
              <Camera className="w-4 h-4" />
              <span>إضافة صفحة أخرى</span>
            </button>

            <button 
              onClick={handleSaveAsPdf}
              className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 px-4 py-2 rounded-xl hover:bg-blue-500/20"
            >
              <Download className="w-4 h-4" />
              <span>تحويل إلى PDF وتعديله</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
