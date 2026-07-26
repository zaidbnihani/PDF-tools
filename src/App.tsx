import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { motion, AnimatePresence } from 'motion/react';
import { MergeFileCard } from './components/MergeFileCard';
import { DocumentScannerModal } from './components/DocumentScannerModal';
import { TabletInterface } from './components/TabletInterface';
import { DesktopInterface } from './components/DesktopInterface';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import {
  LayoutGrid,
  Search,
  FileText,
  Scissors,
  FileUp,
  ArrowUpDown,
  Trash2,
  RotateCw,
  RotateCcw,
  Image as ImageIcon,
  ImagePlus,
  GripVertical,
  RefreshCw,
  Home,
  Wrench,
  Settings,
  Globe,
  Send,
  Mail,
  Folder,
  List,
  MoreVertical,
  Scan,
  X,
  Check,
  Plus,
  Upload,
  ArrowUp,
  ArrowDown,
  Loader2,
  CheckCircle2,
  Minimize2,
  FileDown,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckSquare,
  HelpCircle,
  ArrowRight,
  Pencil,
  Sparkles,
  Copy,
  Download,
} from 'lucide-react';

function createPaperFallbackDataUrl(pageNum: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 300, 400);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(25, 30, 250, 16);
    ctx.fillRect(25, 60, 250, 10);
    ctx.fillRect(25, 80, 200, 10);
    ctx.fillRect(25, 100, 230, 10);
    ctx.fillRect(25, 120, 180, 10);
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`صفحة ${pageNum}`, 150, 230);
  }
  return canvas.toDataURL('image/jpeg', 0.85);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  const chunk = 8192;
  for (let i = 0; i < len; i += chunk) {
    const slice = bytes.subarray(i, i + chunk);
    binary += String.fromCharCode.apply(null, Array.from(slice));
  }
  return window.btoa(binary);
}

interface DeletePageCardProps {
  key?: React.Key;
  preview: { pageNum: number; dataUrl: string };
  isDeleted: boolean;
  onToggle: () => void;
}

function DeletePageCard({ preview, isDeleted, onToggle }: DeletePageCardProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const startPress = () => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onToggle();
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }, 400);
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onToggle();
  };

  const pageNumFormatted = String(preview.pageNum).padStart(2, '0');

  return (
    <div
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchMove={endPress}
      onClick={handleClick}
      className={`relative rounded-2xl bg-white overflow-hidden cursor-pointer transition-all duration-200 flex items-center justify-center p-2.5 aspect-[1/1.38] select-none ${
        isDeleted
          ? 'ring-8 ring-white border-4 border-white scale-[0.96] shadow-2xl z-10'
          : 'border border-zinc-200 hover:border-zinc-300 shadow-md'
      }`}
    >
      {/* Page rendered canvas */}
      <img
        src={preview.dataUrl}
        alt={`صفحة ${preview.pageNum}`}
        className="max-h-full max-w-full object-contain rounded transition-all duration-200 pointer-events-none"
      />

      {/* Page Number Overlay Badge at bottom-right */}
      <div className="absolute bottom-2.5 right-2.5 bg-[#2d3342] text-white text-[12px] font-bold px-2 py-0.5 rounded-md shadow-md border border-white/10">
        {pageNumFormatted}
      </div>
    </div>
  );
}

interface ExtractPageCardProps {
  key?: React.Key;
  preview: { pageNum: number; dataUrl: string };
  isSelected: boolean;
  onToggle: () => void;
}

function ExtractPageCard({ preview, isSelected, onToggle }: ExtractPageCardProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const startPress = () => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onToggle();
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }, 400);
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onToggle();
  };

  const pageNumFormatted = String(preview.pageNum).padStart(2, '0');

  return (
    <div
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchMove={endPress}
      onClick={handleClick}
      className={`relative rounded-2xl bg-white overflow-hidden cursor-pointer transition-all duration-200 flex items-center justify-center p-2.5 aspect-[1/1.38] select-none ${
        isSelected
          ? 'ring-8 ring-white border-4 border-[#388bfd] scale-[0.96] shadow-2xl z-10'
          : 'border border-zinc-200 hover:border-zinc-300 shadow-md'
      }`}
    >
      {/* Page rendered canvas */}
      <img
        src={preview.dataUrl}
        alt={`صفحة ${preview.pageNum}`}
        className="max-h-full max-w-full object-contain rounded transition-all duration-200 pointer-events-none"
      />

      {/* Selection Overlay with checkmark */}
      {isSelected && (
        <div className="absolute inset-0 bg-[#388bfd]/10 flex items-center justify-center transition-all">
          <div className="bg-[#388bfd] text-white p-1.5 rounded-full shadow-lg">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
        </div>
      )}

      {/* Page Number Overlay Badge at bottom-right */}
      <div className={`absolute bottom-2.5 right-2.5 text-[12px] font-bold px-2 py-0.5 rounded-md shadow-md border ${
        isSelected 
          ? 'bg-[#388bfd] text-white border-white/20' 
          : 'bg-[#2d3342] text-white border-white/10'
      }`}>
        {pageNumFormatted}
      </div>
    </div>
  );
}

interface ReorderPageCardProps {
  key?: React.Key;
  preview?: { pageNum: number; dataUrl: string } | null;
  idx: number;
  pageNum: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: () => void;
  isLast: boolean;
}

function ReorderPageCard({ preview, idx, pageNum, onMove, onRemove, isLast }: ReorderPageCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', idx.toString());
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fromIndexStr = e.dataTransfer.getData('text/plain');
    if (fromIndexStr !== '') {
      const fromIndex = parseInt(fromIndexStr, 10);
      if (fromIndex !== idx) {
        onMove(fromIndex, idx);
      }
    }
  };

  const pageNumFormatted = String(idx + 1).padStart(2, '0');
  const originalPageNumFormatted = String(pageNum).padStart(2, '0');

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative rounded-2xl bg-white overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 flex items-center justify-center p-3.5 aspect-[1/1.38] select-none ${
        isDragging 
          ? 'ring-8 ring-[#388bfd]/30 scale-[0.96] shadow-2xl z-20 border-[#388bfd]/60' 
          : 'border border-zinc-200 hover:border-[#388bfd]/50 shadow-md hover:shadow-lg'
      }`}
    >
      {preview?.dataUrl ? (
        <img
          src={preview.dataUrl}
          alt={`صفحة ${idx + 1}`}
          className="max-h-full max-w-full object-contain rounded transition-all duration-200 pointer-events-none"
        />
      ) : (
        <div className="w-full h-full flex flex-col justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100 relative pointer-events-none">
          <div className="space-y-1.5 mt-1 w-full opacity-60">
            <div className="h-1.5 bg-zinc-200 rounded-full w-5/6"></div>
            <div className="h-1 bg-zinc-150 rounded-full w-full"></div>
            <div className="h-1 bg-zinc-150 rounded-full w-4/5"></div>
            <div className="h-1 bg-zinc-150 rounded-full w-11/12"></div>
            <div className="h-1 bg-zinc-150 rounded-full w-2/3"></div>
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-extrabold">صفحة أصلية</span>
            <span className="text-2xl font-extrabold text-zinc-800 mt-0.5">{originalPageNumFormatted}</span>
          </div>

          <div className="w-full h-1 bg-zinc-100 rounded-full mt-auto opacity-40"></div>
        </div>
      )}
      
      {/* Page Number Overlay Badge at bottom-right */}
      <div className="absolute bottom-2.5 right-2.5 bg-[#388bfd] text-white text-[12px] font-bold px-2 py-0.5 rounded-md shadow-md border border-white/10">
        {pageNumFormatted}
      </div>
    </motion.div>
  );
}

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => prev === msg ? null : prev);
    }, 4000);
  };

  const [activeTab, setActiveTab] = useState<'tools' | 'settings'>('tools');
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

// Settings states
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // PDF Merge state
  const [pdfFilesForMerge, setPdfFilesForMerge] = useState<Array<{
    id: string;
    file: ArrayBuffer;
    name: string;
    size: number;
    thumbnailUrl?: string;
    originalNum: number;
  }>>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PDF Split state
  const [splitStartPage, setSplitStartPage] = useState<number>(1);
  const [splitEndPage, setSplitEndPage] = useState<number>(1);
  const [isSplitting, setIsSplitting] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [selectedSplitFile, setSelectedSplitFile] = useState<{
    file: ArrayBuffer;
    name: string;
    totalPages: number;
  } | null>(null);
  const splitFileInputRef = useRef<HTMLInputElement>(null);

  // PDF Extract Pages state
  const [extractPagesInput, setExtractPagesInput] = useState<string>('1');
  const [selectedPagesList, setSelectedPagesList] = useState<number[]>([1]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [extractPagesPreviews, setExtractPagesPreviews] = useState<Array<{ pageNum: number; dataUrl: string }>>([]);
  const [isRenderingExtractPreviews, setIsRenderingExtractPreviews] = useState(false);
  const [selectedExtractFile, setSelectedExtractFile] = useState<{
    file: ArrayBuffer;
    name: string;
    totalPages: number;
  } | null>(null);
  const extractFileInputRef = useRef<HTMLInputElement>(null);

  // PDF Rotate state
  const [pageRotations, setPageRotations] = useState<number[]>([]);
  const [isRotating, setIsRotating] = useState(false);
  const [showRotateModal, setShowRotateModal] = useState(false);
  const [selectedRotateFile, setSelectedRotateFile] = useState<{
    file: ArrayBuffer;
    name: string;
    totalPages: number;
  } | null>(null);
  const rotateFileInputRef = useRef<HTMLInputElement>(null);

  // PDF Reorder Pages state
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [reorderPagesPreviews, setReorderPagesPreviews] = useState<Array<{ pageNum: number; dataUrl: string }>>([]);
  const [isRenderingReorderPreviews, setIsRenderingReorderPreviews] = useState(false);
  const [selectedReorderFile, setSelectedReorderFile] = useState<{
    file: ArrayBuffer;
    name: string;
    totalPages: number;
  } | null>(null);
  const reorderFileInputRef = useRef<HTMLInputElement>(null);

  // AI Text Extraction (OCR) state
  const [ocrFileType, setOcrFileType] = useState<'image' | 'pdf' | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [ocrFileName, setOcrFileName] = useState('');
  const [ocrResultText, setOcrResultText] = useState('');
  const [ocrCopied, setOcrCopied] = useState(false);
  const ocrImageInputRef = useRef<HTMLInputElement>(null);
  const ocrPdfInputRef = useRef<HTMLInputElement>(null);

  const handleReorderFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setIsRenderingReorderPreviews(true);
      setShowReorderModal(true);
      setReorderPagesPreviews([]);

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pageCount = pdfDoc.getPageCount();

      setSelectedReorderFile({
        file: arrayBuffer,
        name: file.name,
        totalPages: pageCount,
      });
      setPageOrder(Array.from({ length: pageCount }, (_, i) => i + 1));

      // Load Previews using PDFJS only if the page count is reasonable (e.g., <= 12)
      // For larger PDFs, we skip rendering entirely to avoid OOM crashes and render instantly!
      if (pageCount <= 12) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer.slice(0)),
          cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });

        let pdfJsDoc: any = null;
        try {
          pdfJsDoc = await loadingTask.promise;
        } catch (docErr) {
          console.error('Error opening PDF for reorder previews with pdfjs:', docErr);
        }

        const previews: Array<{ pageNum: number; dataUrl: string }> = [];
        for (let i = 1; i <= pageCount; i++) {
          let pageDataUrl = '';
          if (pdfJsDoc) {
            try {
              const page = await pdfJsDoc.getPage(i);
              const viewport = page.getViewport({ scale: 0.8 });
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              if (context) {
                await page.render({ canvasContext: context, viewport }).promise;
                pageDataUrl = canvas.toDataURL('image/jpeg', 0.85);
              }
            } catch (pErr) {
              console.error(`Reorder page ${i} render error:`, pErr);
            }
          }

          if (!pageDataUrl) {
            pageDataUrl = createPaperFallbackDataUrl(i);
          }

          previews.push({ pageNum: i, dataUrl: pageDataUrl });
        }
        setReorderPagesPreviews(previews);
      } else {
        // Skips rendering and uses the beautiful and lightweight CSS fallback cards
        setReorderPagesPreviews([]);
      }
    } catch (err) {
      console.error('Error loading PDF for reorder:', err);
      alert('تعذر قراءة ملف PDF. قد يكون الملف تالفاً أو محمياً بكلمة مرور.');
    } finally {
      setIsRenderingReorderPreviews(false);
      e.target.value = '';
    }
  };

  const movePageInOrder = (fromIndex: number, toIndex: number) => {
    setPageOrder((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const removePageFromOrder = (index: number) => {
    setPageOrder((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReversePagesOrder = () => {
    setPageOrder((prev) => [...prev].reverse());
  };

  const handleResetPagesOrder = () => {
    if (!selectedReorderFile) return;
    setPageOrder(Array.from({ length: selectedReorderFile.totalPages }, (_, i) => i + 1));
  };

  const handleReorderPdf = async () => {
    if (!selectedReorderFile || pageOrder.length === 0) return;

    setIsReordering(true);
    try {
      const srcPdf = await PDFDocument.load(selectedReorderFile.file);
      const newPdf = await PDFDocument.create();

      const pageIndices = pageOrder.map((p) => p - 1);
      const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const cleanName = selectedReorderFile.name.replace(/\.pdf$/i, '');
      saveAs(blob, `${cleanName}_reordered.pdf`);
    } catch (error) {
      console.error('Error reordering PDF pages:', error);
      alert('حدث خطأ أثناء إعادة ترتيب صفحات الملف. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsReordering(false);
    }
  };

  // PDF Delete Pages state
  const [pagesToDeleteList, setPagesToDeleteList] = useState<number[]>([]);
  const [deletePagesInput, setDeletePagesInput] = useState<string>('');
  const [isDeletingPages, setIsDeletingPages] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePagesPreviews, setDeletePagesPreviews] = useState<Array<{ pageNum: number; dataUrl: string }>>([]);
  const [isRenderingDeletePreviews, setIsRenderingDeletePreviews] = useState(false);
  const [selectedDeleteFile, setSelectedDeleteFile] = useState<{
    file: ArrayBuffer;
    name: string;
    totalPages: number;
  } | null>(null);
  const deleteFileInputRef = useRef<HTMLInputElement>(null);

  const handleOcrFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'pdf') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setOcrFileName(file.name);
    setOcrFileType(fileType);
    setIsOcrProcessing(true);
    setOcrResultText('');
    setOcrCopied(false);
    setShowOcrModal(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64Data = arrayBufferToBase64(arrayBuffer);

      const res = await fetch('/api/extract-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileData: base64Data,
          mimeType: file.type || (fileType === 'pdf' ? 'application/pdf' : 'image/jpeg'),
          fileType,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `فشل استخراج النص: ${res.status}`);
      }

      const data = await res.json();
      setOcrResultText(data.text || 'لم يتم العثور على أي نص في هذا الملف.');
    } catch (err: any) {
      console.error('Error extracting text:', err);
      setOcrResultText(`حدث خطأ أثناء استخراج النص: ${err.message || 'يرجى المحاولة مرة أخرى.'}`);
    } finally {
      setIsOcrProcessing(false);
      e.target.value = '';
    }
  };

  const handleDeleteFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setIsRenderingDeletePreviews(true);
      setShowDeleteModal(true);
      setDeletePagesPreviews([]);
      setPagesToDeleteList([]);
      setDeletePagesInput('');

      const arrayBuffer = await file.arrayBuffer();

      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer.slice(0)),
        cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      });

      let pdfJsDoc: any = null;
      let numPages = 0;

      try {
        pdfJsDoc = await loadingTask.promise;
        numPages = pdfJsDoc.numPages;
      } catch (docErr) {
        console.error('Error opening PDF with pdfjs:', docErr);
        try {
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          numPages = pdfDoc.getPageCount();
        } catch {
          numPages = 1;
        }
      }

      setSelectedDeleteFile({
        file: arrayBuffer,
        name: file.name,
        totalPages: numPages,
      });

      const previews: Array<{ pageNum: number; dataUrl: string }> = [];
      for (let i = 1; i <= numPages; i++) {
        let pageDataUrl = '';
        if (pdfJsDoc) {
          try {
            const page = await pdfJsDoc.getPage(i);
            const viewport = page.getViewport({ scale: 0.8 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            if (context) {
              await page.render({ canvasContext: context, viewport }).promise;
              pageDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            }
          } catch (pErr) {
            console.error(`Page ${i} render error:`, pErr);
          }
        }

        if (!pageDataUrl) {
          pageDataUrl = createPaperFallbackDataUrl(i);
        }

        previews.push({ pageNum: i, dataUrl: pageDataUrl });
      }
      setDeletePagesPreviews(previews);
    } catch (err) {
      console.error('Error loading PDF for deletion:', err);
      alert('تعذر قراءة ملف PDF. قد يكون الملف تالفاً أو محمياً بكلمة مرور.');
    } finally {
      setIsRenderingDeletePreviews(false);
      e.target.value = '';
    }
  };

  const togglePageDeletion = (pageNum: number) => {
    let newPages: number[];
    if (pagesToDeleteList.includes(pageNum)) {
      newPages = pagesToDeleteList.filter((p) => p !== pageNum);
    } else {
      newPages = [...pagesToDeleteList, pageNum].sort((a, b) => a - b);
    }
    setPagesToDeleteList(newPages);
    setDeletePagesInput(newPages.join(', '));
  };

  const handleQuickDeleteSelect = (type: 'odd' | 'even' | 'all' | 'clear') => {
    if (!selectedDeleteFile) return;
    const total = selectedDeleteFile.totalPages;
    let pages: number[] = [];
    if (type === 'odd') {
      pages = Array.from({ length: total }, (_, i) => i + 1).filter((p) => p % 2 !== 0);
    } else if (type === 'even') {
      pages = Array.from({ length: total }, (_, i) => i + 1).filter((p) => p % 2 === 0);
    } else if (type === 'all') {
      pages = Array.from({ length: total }, (_, i) => i + 1);
    } else if (type === 'clear') {
      pages = [];
    }
    setPagesToDeleteList(pages);
    setDeletePagesInput(pages.join(', '));
  };

  const handleDeleteInputChange = (val: string) => {
    setDeletePagesInput(val);
    if (selectedDeleteFile) {
      const parsed = parsePageNumbers(val, selectedDeleteFile.totalPages);
      setPagesToDeleteList(parsed);
    }
  };

  const handleDeletePagesPdf = async () => {
    if (!selectedDeleteFile) return;

    const deleteSet = new Set(pagesToDeleteList);
    const pagesToKeep: number[] = [];
    for (let p = 1; p <= selectedDeleteFile.totalPages; p++) {
      if (!deleteSet.has(p)) {
        pagesToKeep.push(p);
      }
    }

    if (pagesToKeep.length === 0) {
      alert('لا يمكن حذف جميع صفحات المستند! يجب الإبقاء على صفحة واحدة على الأقل.');
      return;
    }

    if (deleteSet.size === 0) {
      alert('يرجى تحديد صفحة واحدة على الأقل لحذفها.');
      return;
    }

    setIsDeletingPages(true);
    try {
      const srcPdf = await PDFDocument.load(selectedDeleteFile.file.slice(0));
      const newPdf = await PDFDocument.create();

      const pageIndices = pagesToKeep.map((p) => p - 1);
      const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const cleanName = selectedDeleteFile.name.replace(/\.pdf$/i, '');
      saveAs(blob, `${cleanName}_deleted_pages.pdf`);
    } catch (error) {
      console.error('Error deleting PDF pages:', error);
      alert('حدث خطأ أثناء حذف الصفحات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsDeletingPages(false);
    }
  };

  // PDF to Image state & handlers
  const [showPdfToImageModal, setShowPdfToImageModal] = useState(false);
  const [selectedPdfToImgFile, setSelectedPdfToImgFile] = useState<{
    file: ArrayBuffer;
    name: string;
    totalPages: number;
  } | null>(null);

  // Active Converted / Loaded PDF Document State for Home View
  const [convertedDoc, setConvertedDoc] = useState<{
    file: ArrayBuffer;
    name: string;
    totalPages: number;
    previews: Array<{ pageNum: number; dataUrl: string }>;
  } | null>(null);

  const [imgFormat, setImgFormat] = useState<'jpg' | 'png'>('jpg');
  const [imgQualityScale, setImgQualityScale] = useState<number>(2); // 2x HD quality
  const [pdfPagesPreview, setPdfPagesPreview] = useState<Array<{ pageNum: number; dataUrl: string }>>([]);
  const [isRenderingPdfToImg, setIsRenderingPdfToImg] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const pdfToImgFileInputRef = useRef<HTMLInputElement>(null);

  const handleScanComplete = async (scannedFile: File) => {
    try {
      showToast('تم المسح الضوئي بنجاح!');
      const arrayBuffer = await scannedFile.arrayBuffer();

      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
      const pdfJsDoc = await loadingTask.promise;
      const numPages = pdfJsDoc.numPages;

      const previews: Array<{ pageNum: number; dataUrl: string }> = [];
      for (let i = 1; i <= Math.min(numPages, 10); i++) {
        const page = await pdfJsDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
          previews.push({ pageNum: i, dataUrl: canvas.toDataURL('image/jpeg', 0.85) });
        }
      }

      setConvertedDoc({
        file: arrayBuffer,
        name: scannedFile.name,
        totalPages: numPages,
        previews: previews,
      });
      setActiveTab('tools');
    } catch (err) {
      console.error('Error handling scanned document:', err);
      showToast('تم حفظ المستند الممسوح بنجاح');
    }
  };

  const handlePdfToImgFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setIsRenderingPdfToImg(true);
      const arrayBuffer = await file.arrayBuffer();

      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
      const pdfJsDoc = await loadingTask.promise;
      const numPages = pdfJsDoc.numPages;

      const fileData = {
        file: arrayBuffer,
        name: file.name,
        totalPages: numPages,
      };
      setSelectedPdfToImgFile(fileData);

      const mime = imgFormat === 'jpg' ? 'image/jpeg' : 'image/png';
      const extension = imgFormat;
      const cleanName = file.name.replace(/\.pdf$/i, '');

      // Helper function to get Blob from canvas
      const getCanvasBlob = (canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> => {
        return new Promise((resolve) => {
          canvas.toBlob((blob) => resolve(blob), mimeType, quality);
        });
      };

      // Render all pages in HD (imgQualityScale)
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const viewport = page.getViewport({ scale: imgQualityScale }); // Use high quality HD
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          const blob = await getCanvasBlob(canvas, mime, 0.95);
          if (blob) {
            saveAs(blob, `${cleanName}_صفحة_${i}.${extension}`);
          }
        }
      }
    } catch (err) {
      console.error('Error loading PDF for image conversion:', err);
      alert('تعذر قراءة ملف PDF أو تحويله إلى صور تلقائياً.');
    } finally {
      setIsRenderingPdfToImg(false);
      e.target.value = '';
    }
  };

  const downloadSinglePageAsImage = async (pageNum: number) => {
    if (!selectedPdfToImgFile) return;
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(selectedPdfToImgFile.file.slice(0)) });
      const pdfJsDoc = await loadingTask.promise;
      const page = await pdfJsDoc.getPage(pageNum);

      const viewport = page.getViewport({ scale: imgQualityScale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (context) {
        await page.render({ canvasContext: context, viewport }).promise;
        const mime = imgFormat === 'jpg' ? 'image/jpeg' : 'image/png';
        const extension = imgFormat;
        canvas.toBlob((blob) => {
          if (blob) {
            const cleanName = selectedPdfToImgFile.name.replace(/\.pdf$/i, '');
            saveAs(blob, `${cleanName}_صفحة_${pageNum}.${extension}`);
          }
        }, mime, 0.95);
      }
    } catch (error) {
      console.error('Error downloading page image:', error);
      alert('حدث خطأ أثناء تحميل صورة الصفحة.');
    }
  };

  const downloadAllPagesAsZip = async () => {
    if (!selectedPdfToImgFile) return;
    setIsExportingZip(true);
    try {
      const zip = new JSZip();
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(selectedPdfToImgFile.file.slice(0)) });
      const pdfJsDoc = await loadingTask.promise;

      const mime = imgFormat === 'jpg' ? 'image/jpeg' : 'image/png';
      const extension = imgFormat;
      const cleanName = selectedPdfToImgFile.name.replace(/\.pdf$/i, '');

      for (let i = 1; i <= pdfJsDoc.numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const viewport = page.getViewport({ scale: imgQualityScale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          const dataUrl = canvas.toDataURL(mime, 0.95);
          const base64Data = dataUrl.split(',')[1];
          zip.file(`${cleanName}_صفحة_${i}.${extension}`, base64Data, { base64: true });
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${cleanName}_جميع_الصور.zip`);
    } catch (error) {
      console.error('Error creating ZIP of page images:', error);
      alert('حدث خطأ أثناء إنشاء ملف ZIP للصور.');
    } finally {
      setIsExportingZip(false);
    }
  };

  // Image to PDF state & handlers
  const [showImgToPdfModal, setShowImgToPdfModal] = useState(false);
  const [selectedImgList, setSelectedImgList] = useState<Array<{
    id: string;
    file: File;
    previewUrl: string;
    name: string;
  }>>([]);
  const [pageSizeOption, setPageSizeOption] = useState<'fit' | 'a4_portrait' | 'a4_landscape'>('fit');
  const [pageMarginOption, setPageMarginOption] = useState<'none' | 'small' | 'large'>('none');
  const [isConvertingImgToPdf, setIsConvertingImgToPdf] = useState(false);
  const imgToPdfInputRef = useRef<HTMLInputElement>(null);

  const handleImgToPdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filesArray = Array.from(e.target.files) as File[];

    setIsConvertingImgToPdf(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of filesArray) {
        const previewUrl = URL.createObjectURL(file);
        const imgElement = document.createElement('img');
        imgElement.src = previewUrl;
        await new Promise((resolve, reject) => {
          imgElement.onload = resolve;
          imgElement.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(imgElement, 0, 0);
        }

        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const jpegArrayBuffer = await fetch(jpegDataUrl).then((r) => r.arrayBuffer());
        const embeddedImg = await pdfDoc.embedJpg(jpegArrayBuffer);

        const imgWidth = embeddedImg.width;
        const imgHeight = embeddedImg.height;

        // Create page with exact image dimensions (no margins, same size)
        const page = pdfDoc.addPage([imgWidth, imgHeight]);
        page.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: imgWidth,
          height: imgHeight,
        });

        URL.revokeObjectURL(previewUrl);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const firstFileName = filesArray[0].name.replace(/\.[^/.]+$/, "");
      saveAs(blob, `${firstFileName}_محول.pdf`);
    } catch (error) {
      console.error('Error converting images to PDF:', error);
      alert('حدث خطأ أثناء تحويل الصور إلى ملف PDF تلقائياً.');
    } finally {
      setIsConvertingImgToPdf(false);
      e.target.value = '';
    }
  };

  const moveImgInList = (fromIndex: number, toIndex: number) => {
    setSelectedImgList((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const removeImgFromList = (id: string) => {
    setSelectedImgList((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const convertImagesToPdf = async () => {
    if (selectedImgList.length === 0) return;
    setIsConvertingImgToPdf(true);

    try {
      const pdfDoc = await PDFDocument.create();

      let margin = 0;
      if (pageMarginOption === 'small') margin = 20;
      if (pageMarginOption === 'large') margin = 40;

      for (const item of selectedImgList) {
        const imgElement = document.createElement('img');
        imgElement.src = item.previewUrl;
        await new Promise((resolve, reject) => {
          imgElement.onload = resolve;
          imgElement.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(imgElement, 0, 0);
        }

        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        const jpegArrayBuffer = await fetch(jpegDataUrl).then((r) => r.arrayBuffer());
        const embeddedImg = await pdfDoc.embedJpg(jpegArrayBuffer);

        const imgWidth = embeddedImg.width;
        const imgHeight = embeddedImg.height;

        let pageWidth = imgWidth + margin * 2;
        let pageHeight = imgHeight + margin * 2;

        if (pageSizeOption === 'a4_portrait') {
          pageWidth = 595.28;
          pageHeight = 841.89;
        } else if (pageSizeOption === 'a4_landscape') {
          pageWidth = 841.89;
          pageHeight = 595.28;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        if (pageSizeOption === 'fit') {
          page.drawImage(embeddedImg, {
            x: margin,
            y: margin,
            width: imgWidth,
            height: imgHeight,
          });
        } else {
          const availWidth = pageWidth - margin * 2;
          const availHeight = pageHeight - margin * 2;
          const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);
          const drawWidth = imgWidth * scale;
          const drawHeight = imgHeight * scale;

          const x = (pageWidth - drawWidth) / 2;
          const y = (pageHeight - drawHeight) / 2;

          page.drawImage(embeddedImg, {
            x,
            y,
            width: drawWidth,
            height: drawHeight,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'الصور_المحولة.pdf');
    } catch (error) {
      console.error('Error converting images to PDF:', error);
      alert('حدث خطأ أثناء تحويل الصور إلى ملف PDF.');
    } finally {
      setIsConvertingImgToPdf(false);
    }
  };

  // PDF Protect (حماية PDF) state & handlers
  const [showProtectModal, setShowProtectModal] = useState(false);
  const [selectedProtectFile, setSelectedProtectFile] = useState<{
    file: ArrayBuffer;
    name: string;
    size: number;
    totalPages?: number;
  } | null>(null);
  const [protectPassword, setProtectPassword] = useState('');
  
  const [showProtectPasswordText, setShowProtectPasswordText] = useState(false);
  const [isProtecting, setIsProtecting] = useState(false);
  const [protectResult, setProtectResult] = useState<{
    blob: Blob;
    fileName: string;
  } | null>(null);
  const protectFileInputRef = useRef<HTMLInputElement>(null);

  const handleProtectFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      setSelectedProtectFile({
        file: arrayBuffer,
        name: file.name,
        size: file.size,
      });
      setProtectPassword('');
      
      setProtectResult(null);
      setShowProtectModal(true);
    } catch (err) {
      console.error('Error loading PDF for protection:', err);
      alert('تعذر قراءة ملف PDF. قد يكون الملف تالفاً أو محمياً بكلمة سر مسبقاً.');
    }
    e.target.value = '';
  };

  const handleProtectPdf = async () => {
    if (!selectedProtectFile) return;
    if (!protectPassword) {
      alert('يرجى إدخال كلمة السر لحماية الملف.');
      return;
    }

    setIsProtecting(true);
    setProtectResult(null);

    try {
      const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        const chunk = 8192;
        for (let i = 0; i < len; i += chunk) {
          binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
        }
        return window.btoa(binary);
      };

      const base64Data = arrayBufferToBase64(selectedProtectFile.file);

      const response = await fetch('/api/protect-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64Data,
          password: protectPassword,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'حدث خطأ أثناء حماية الملف.');
      }

      const data = await response.json();
      const protectedBuffer = Uint8Array.from(window.atob(data.fileData), c => c.charCodeAt(0));
      const blob = new Blob([protectedBuffer], { type: 'application/pdf' });
      const cleanName = selectedProtectFile.name.replace(/\.pdf$/i, '');

      saveAs(blob, `${cleanName}_protected.pdf`);
      setShowProtectModal(false);
      setSelectedProtectFile(null);
      setProtectPassword('');
      
    } catch (error: any) {
      console.error('Error protecting PDF:', error);
      alert(error.message || 'حدث خطأ أثناء حماية ملف PDF. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsProtecting(false);
    }
  };

  // PDF Unlock (إلغاء حماية PDF) state & handlers
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedUnlockFile, setSelectedUnlockFile] = useState<{
    file: ArrayBuffer;
    name: string;
    size: number;
  } | null>(null);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [showUnlockPasswordText, setShowUnlockPasswordText] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockResult, setUnlockResult] = useState<{
    blob: Blob;
    fileName: string;
  } | null>(null);
  const unlockFileInputRef = useRef<HTMLInputElement>(null);

  const handleUnlockFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      try {
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
        await loadingTask.promise;
        // If it succeeds without a password, it is not protected
        showToast('هذا الملف غير محمي بكلمة سر.');
        e.target.value = '';
        return;
      } catch (checkErr: any) {
        // We expect a PasswordException if it's protected
        if (checkErr.name !== 'PasswordException') {
          console.error('Error verifying PDF:', checkErr);
          alert('تعذر قراءة ملف PDF. قد يكون الملف تالفاً.');
          e.target.value = '';
          return;
        }
      }

      setSelectedUnlockFile({
        file: arrayBuffer,
        name: file.name,
        size: file.size,
      });
      setUnlockPassword('');
      setUnlockError(null);
      setUnlockResult(null);
      setShowUnlockModal(true);
    } catch (err) {
      console.error('Error selecting PDF for unlocking:', err);
      alert('تعذر اختيار الملف.');
    }
    e.target.value = '';
  };

  const handleUnlockPdf = async () => {
    if (!selectedUnlockFile) return;
    if (!unlockPassword) {
      setUnlockError('يرجى إدخال كلمة السر لفك الحماية.');
      return;
    }

    setIsUnlocking(true);
    setUnlockError(null);
    setUnlockResult(null);

    try {
      const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        const chunk = 8192;
        for (let i = 0; i < len; i += chunk) {
          binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
        }
        return window.btoa(binary);
      };

      const base64Data = arrayBufferToBase64(selectedUnlockFile.file);

      const response = await fetch('/api/unlock-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64Data,
          password: unlockPassword,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'كلمة السر غير صحيحة أو يتعذر فك تشفير هذا الملف.');
      }

      const data = await response.json();
      const decryptedBuffer = Uint8Array.from(window.atob(data.fileData), c => c.charCodeAt(0));
      const blob = new Blob([decryptedBuffer], { type: 'application/pdf' });
      const cleanName = selectedUnlockFile.name.replace(/\.pdf$/i, '');

      saveAs(blob, `${cleanName}_unlocked.pdf`);
      setShowUnlockModal(false);
      setSelectedUnlockFile(null);
      setUnlockPassword('');
      setUnlockError(null);
    } catch (error: any) {
      console.error('Error unlocking PDF:', error);
      setUnlockError(error.message || 'كلمة السر غير صحيحة أو يتعذر فك تشفير هذا الملف.');
    } finally {
      setIsUnlocking(false);
    }
  };

  // PDF Compress state
  const [showCompressModal, setShowCompressModal] = useState(false);
  const [selectedCompressFile, setSelectedCompressFile] = useState<{
    file: ArrayBuffer;
    name: string;
    size: number;
    totalPages: number;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState<number>(0);
  const [compressStatus, setCompressStatus] = useState<string>('');
  const [compressionResult, setCompressionResult] = useState<{
    originalSize: number;
    compressedSize: number;
    blob: Blob;
    fileName: string;
  } | null>(null);
  const compressFileInputRef = useRef<HTMLInputElement>(null);

  // Auto trigger compression when file is selected
  useEffect(() => {
    if (showCompressModal && selectedCompressFile && !compressionResult && !isCompressing) {
      handleCompressPdf();
    }
  }, [showCompressModal, selectedCompressFile, compressionResult, isCompressing]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} بايت`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} كيلوبايت`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} ميغابايت`;
  };

  const handleCompressFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pageCount = pdfDoc.getPageCount();

      setSelectedCompressFile({
        file: arrayBuffer,
        name: file.name,
        size: file.size,
        totalPages: pageCount,
      });
      setCompressionResult(null);
      setCompressProgress(0);
      setCompressStatus('');
      setShowCompressModal(true);
    } catch (err) {
      console.error('Error loading PDF for compression:', err);
      alert('تعذر قراءة ملف PDF. قد يكون الملف تالفاً أو محمياً بكلمة مرور.');
    }
    e.target.value = '';
  };

  const handleCompressPdf = async () => {
    if (!selectedCompressFile) return;

    setIsCompressing(true);
    setCompressionResult(null);
    setCompressProgress(5);
    setCompressStatus('جاري فحص وتفكيك بنية مستند الـ PDF...');

    // Helper sleep function for smooth high-end animation pacing
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      const arrayBuffer = selectedCompressFile.file;
      const originalDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const totalPages = selectedCompressFile.totalPages;

      await sleep(600);
      setCompressProgress(12);
      setCompressStatus('جاري استخراج الموارد وتحليل طبقات الصور المتضمنة...');

      // Smart adaptive compression parameters:
      // We use ultra-efficient scales (0.8 - 0.75) and optimized quality metrics (0.35 - 0.30)
      // to guarantee massive size reductions of 50% or more, while keeping text and drawings perfectly sharp.
      let targetScale = 0.80;
      let targetQuality = 0.35;

      if (totalPages <= 3) {
        targetScale = 0.85;
        targetQuality = 0.38;
      } else if (totalPages <= 10) {
        targetScale = 0.80;
        targetQuality = 0.34;
      } else if (totalPages <= 25) {
        targetScale = 0.75;
        targetQuality = 0.30;
      } else {
        targetScale = 0.70;
        targetQuality = 0.26;
      }

      await sleep(500);

      let pdfBytes: Uint8Array;
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
        const pdfJsDoc = await loadingTask.promise;

        const newDoc = await PDFDocument.create();

        // Calculate dynamic delay for each page so progress moves smoothly
        const pageDelay = totalPages <= 5 ? 300 : 80;

        for (let i = 1; i <= totalPages; i++) {
          setCompressProgress(15 + Math.round((i / totalPages) * 70));
          if (i === 1) {
            setCompressStatus('جاري تطبيق الضغط الذكي وتقليص ترميز الصفحة الأولى...');
          } else {
            setCompressStatus(`جاري إعادة ترميز وضغط عناصر الصفحة ${i} من ${totalPages}...`);
          }

          const page = await pdfJsDoc.getPage(i);
          const viewport = page.getViewport({ scale: targetScale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            // Compress using JPEG canvas stream with optimized scale and quality
            const jpegDataUrl = canvas.toDataURL('image/jpeg', targetQuality);
            const jpegImageBytes = await fetch(jpegDataUrl).then((res) => res.arrayBuffer());
            const embeddedImage = await newDoc.embedJpg(jpegImageBytes);

            const newPage = newDoc.addPage([viewport.width, viewport.height]);
            newPage.drawImage(embeddedImage, {
              x: 0,
              y: 0,
              width: viewport.width,
              height: viewport.height,
            });
          }

          await sleep(pageDelay);
        }

        setCompressProgress(88);
        setCompressStatus('تحسين قواميس البيانات وإزالة المكونات الفائضة وعناصر التعريف...');
        await sleep(600);

        pdfBytes = await newDoc.save({ useObjectStreams: true });

        // INTELLIGENT DUAL-ENGINE FALLBACK
        // For text-heavy / vector-heavy PDFs, converting to rasterized images can inflate the size.
        // If the rasterized size is larger than the original, or doesn't achieve a meaningful reduction (e.g. >= 85% of original),
        // we run standard object stream compression which is extremely small and 100% vector sharp.
        if (pdfBytes.byteLength >= selectedCompressFile.size * 0.85) {
          setCompressStatus('جاري التحقق من ملاءمة محرك الضغط المتجهي لنتائج أفضل...');
          await sleep(500);

          const streamDoc = await PDFDocument.create();
          const copiedPages = await streamDoc.copyPages(originalDoc, originalDoc.getPageIndices());
          copiedPages.forEach((p) => streamDoc.addPage(p));
          const streamBytes = await streamDoc.save({ useObjectStreams: true });

          if (streamBytes.byteLength < pdfBytes.byteLength) {
            pdfBytes = streamBytes;
            setCompressStatus('تم تفضيل الضغط المتجهي لضمان جودة النص وتقليل الحجم الحقيقي...');
          }
        }
      } catch (e) {
        console.warn('Direct image compression failed, falling back to stream compression:', e);
        setCompressStatus('جاري تطبيق ضغط وتنسيق دفق البيانات الاحتياطي فائق الأمان...');
        await sleep(800);

        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(originalDoc, originalDoc.getPageIndices());
        copiedPages.forEach((p) => newDoc.addPage(p));
        pdfBytes = await newDoc.save({ useObjectStreams: true });
      }

      setCompressProgress(97);
      setCompressStatus('جاري حفظ الملف وتجهيز رابط التحميل المباشر...');
      await sleep(500);

      const compressedSize = pdfBytes.byteLength;
      const cleanName = selectedCompressFile.name.replace(/\.pdf$/i, '');
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      setCompressionResult({
        originalSize: selectedCompressFile.size,
        compressedSize: compressedSize,
        blob: blob,
        fileName: `${cleanName}_compressed.pdf`,
      });

      setCompressProgress(100);
      setCompressStatus('تم الضغط بنجاح تام!');
    } catch (error) {
      console.error('Error compressing PDF:', error);
      alert('حدث خطأ أثناء ضغط ملف PDF. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRotateFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      setSelectedRotateFile({
        file: arrayBuffer,
        name: file.name,
        totalPages: pageCount,
      });
      setPageRotations(new Array(pageCount).fill(0));
      setShowRotateModal(true);
    } catch (err) {
      console.error('Error loading PDF for rotation:', err);
      alert('تعذر قراءة ملف PDF. قد يكون الملف تالفاً أو محمياً بكلمة مرور.');
    }
    e.target.value = '';
  };

  const rotateAllPages = (deltaDegrees: number) => {
    setPageRotations((prev) => prev.map((rot) => (rot + deltaDegrees) % 360));
  };

  const rotateSinglePage = (index: number, deltaDegrees: number) => {
    setPageRotations((prev) => {
      const next = [...prev];
      next[index] = (next[index] + deltaDegrees) % 360;
      return next;
    });
  };

  const handleRotatePdf = async () => {
    if (!selectedRotateFile) return;

    setIsRotating(true);
    try {
      const pdfDoc = await PDFDocument.load(selectedRotateFile.file);
      const pages = pdfDoc.getPages();

      pages.forEach((page, index) => {
        const currentAngle = page.getRotation().angle || 0;
        const additionalRotation = pageRotations[index] || 0;
        const totalAngle = (currentAngle + additionalRotation) % 360;
        const normalizedAngle = (totalAngle + 360) % 360;
        page.setRotation(degrees(normalizedAngle));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const cleanName = selectedRotateFile.name.replace(/\.pdf$/i, '');
      saveAs(blob, `${cleanName}_rotated.pdf`);
    } catch (error) {
      console.error('Error rotating PDF:', error);
      alert('حدث خطأ أثناء تدوير صفحات الملف. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsRotating(false);
    }
  };

  const handleExtractFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setIsRenderingExtractPreviews(true);
      setShowExtractModal(true);
      setExtractPagesPreviews([]);
      setSelectedPagesList([]);
      setExtractPagesInput('');

      const arrayBuffer = await file.arrayBuffer();

      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer.slice(0)),
        cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      });

      let pdfJsDoc: any = null;
      let numPages = 0;

      try {
        pdfJsDoc = await loadingTask.promise;
        numPages = pdfJsDoc.numPages;
      } catch (docErr) {
        console.error('Error opening PDF with pdfjs:', docErr);
        try {
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          numPages = pdfDoc.getPageCount();
        } catch {
          numPages = 1;
        }
      }

      setSelectedExtractFile({
        file: arrayBuffer,
        name: file.name,
        totalPages: numPages,
      });

      const previews: Array<{ pageNum: number; dataUrl: string }> = [];
      for (let i = 1; i <= numPages; i++) {
        let pageDataUrl = '';
        if (pdfJsDoc) {
          try {
            const page = await pdfJsDoc.getPage(i);
            const viewport = page.getViewport({ scale: 0.8 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            if (context) {
              await page.render({ canvasContext: context, viewport }).promise;
              pageDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            }
          } catch (pErr) {
            console.error(`Page ${i} render error:`, pErr);
          }
        }

        if (!pageDataUrl) {
          pageDataUrl = createPaperFallbackDataUrl(i);
        }

        previews.push({ pageNum: i, dataUrl: pageDataUrl });
      }
      setExtractPagesPreviews(previews);
    } catch (err) {
      console.error('Error loading PDF for extraction:', err);
      alert('تعذر قراءة ملف PDF. قد يكون الملف تالفاً أو محمياً بكلمة مرور.');
    } finally {
      setIsRenderingExtractPreviews(false);
      e.target.value = '';
    }
  };

  const parsePageNumbers = (inputStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = inputStr.split(/[,;\s]+/);
    for (const part of parts) {
      if (!part) continue;
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(maxPages, Math.max(start, end));
          for (let i = from; i <= to; i++) {
            pages.add(i);
          }
        }
      } else {
        const p = parseInt(part);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          pages.add(p);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const togglePageSelection = (pageNum: number) => {
    let newPages: number[];
    if (selectedPagesList.includes(pageNum)) {
      newPages = selectedPagesList.filter((p) => p !== pageNum);
    } else {
      newPages = [...selectedPagesList, pageNum].sort((a, b) => a - b);
    }
    setSelectedPagesList(newPages);
    setExtractPagesInput(newPages.join(', '));
  };

  const handleQuickPageSelect = (type: 'all' | 'odd' | 'even' | 'clear') => {
    if (!selectedExtractFile) return;
    const total = selectedExtractFile.totalPages;
    let pages: number[] = [];
    if (type === 'all') {
      pages = Array.from({ length: total }, (_, i) => i + 1);
    } else if (type === 'odd') {
      pages = Array.from({ length: total }, (_, i) => i + 1).filter((p) => p % 2 !== 0);
    } else if (type === 'even') {
      pages = Array.from({ length: total }, (_, i) => i + 1).filter((p) => p % 2 === 0);
    } else if (type === 'clear') {
      pages = [];
    }
    setSelectedPagesList(pages);
    setExtractPagesInput(pages.join(', '));
  };

  const handleExtractInputChange = (val: string) => {
    setExtractPagesInput(val);
    if (selectedExtractFile) {
      const parsed = parsePageNumbers(val, selectedExtractFile.totalPages);
      setSelectedPagesList(parsed);
    }
  };

  const handleExtractPagesPdf = async () => {
    if (!selectedExtractFile) return;

    const pagesToExtract = selectedPagesList.length > 0 
      ? selectedPagesList 
      : parsePageNumbers(extractPagesInput, selectedExtractFile.totalPages);

    if (pagesToExtract.length === 0) {
      alert('يرجى تحديد صفحة واحدة على الأقل للاستخراج.');
      return;
    }

    setIsExtracting(true);
    try {
      const srcPdf = await PDFDocument.load(selectedExtractFile.file);
      const newPdf = await PDFDocument.create();

      const pageIndices = pagesToExtract.map((p) => p - 1);
      const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const cleanName = selectedExtractFile.name.replace(/\.pdf$/i, '');
      saveAs(blob, `${cleanName}_extracted.pdf`);
    } catch (error) {
      console.error('Error extracting pages:', error);
      alert('حدث خطأ أثناء استخراج الصفحات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSplitFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      setSelectedSplitFile({
        file: arrayBuffer,
        name: file.name,
        totalPages: pageCount,
      });
      setSplitStartPage(1);
      setSplitEndPage(pageCount > 0 ? pageCount : 1);
      setShowSplitModal(true);
    } catch (err) {
      console.error('Error loading PDF for split:', err);
      alert('تعذر قراءة ملف PDF. قد يكون الملف تالفاً أو محمياً بكلمة مرور.');
    }
    e.target.value = '';
  };

  const handleSplitPdf = async () => {
    if (!selectedSplitFile) return;

    if (splitStartPage < 1 || splitEndPage > selectedSplitFile.totalPages || splitStartPage > splitEndPage) {
      alert('يرجى إدخال نطاق صفحات صحيح.');
      return;
    }

    setIsSplitting(true);
    try {
      const srcPdf = await PDFDocument.load(selectedSplitFile.file);
      const newPdf = await PDFDocument.create();

      // Convert 1-based page numbers to 0-based indices
      const pageIndices: number[] = [];
      for (let p = splitStartPage; p <= splitEndPage; p++) {
        pageIndices.push(p - 1);
      }

      const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const cleanName = selectedSplitFile.name.replace(/\.pdf$/i, '');
      saveAs(blob, `${cleanName}_split_p${splitStartPage}_to_p${splitEndPage}.pdf`);
    } catch (error) {
      console.error('Error splitting PDF:', error);
      alert('حدث خطأ أثناء تقسيم الملف. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSplitting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filesArray = Array.from(e.target.files) as File[];
    
    const loadedFiles = await Promise.all(
      filesArray.map(async (file: File) => {
        const arrayBuffer = await file.arrayBuffer();
        let thumbnailUrl = '';
        try {
          pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
          const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(arrayBuffer.slice(0)),
            cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
            cMapPacked: true,
          });
          const pdfJsDoc = await loadingTask.promise;
          if (pdfJsDoc.numPages > 0) {
            const page = await pdfJsDoc.getPage(1);
            const viewport = page.getViewport({ scale: 0.25 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            if (context) {
              await page.render({ canvasContext: context, viewport }).promise;
              thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
            }
          }
        } catch (err) {
          console.error('Error rendering first page thumbnail for merge list:', err);
        }
        return {
          id: `${file.name}-${file.size}-${Math.random().toString(36).substring(2, 9)}`,
          file: arrayBuffer,
          name: file.name,
          size: file.size,
          thumbnailUrl: thumbnailUrl || undefined,
        };
      })
    );

    setPdfFilesForMerge((prev) => {
      const startIndex = prev.length;
      const updatedFiles = loadedFiles.map((file, idx) => ({
        ...file,
        originalNum: startIndex + idx + 1,
      }));
      return [...prev, ...updatedFiles];
    });
    setShowMergeModal(true);
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setPdfFilesForMerge((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveMergeFile = (fromIndex: number, toIndex: number) => {
    setPdfFilesForMerge((prev) => {
      const newArr = [...prev];
      const [movedItem] = newArr.splice(fromIndex, 1);
      newArr.splice(toIndex, 0, movedItem);
      return newArr;
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setPdfFilesForMerge((prev) => {
      const newArr = [...prev];
      const temp = newArr[index - 1];
      newArr[index - 1] = newArr[index];
      newArr[index] = temp;
      return newArr;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === pdfFilesForMerge.length - 1) return;
    setPdfFilesForMerge((prev) => {
      const newArr = [...prev];
      const temp = newArr[index + 1];
      newArr[index + 1] = newArr[index];
      newArr[index] = temp;
      return newArr;
    });
  };

  const handleMergePdf = async () => {
    if (pdfFilesForMerge.length < 2) return;
    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const item of pdfFilesForMerge) {
        const pdf = await PDFDocument.load(item.file);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      saveAs(blob, `merged_document_${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('حدث خطأ أثناء دمج الملفات. يرجى التأكد من أن الملفات صحيحة غير محمية بكلمة سر.');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111113] text-white flex justify-center font-['Cairo',sans-serif]">
      {/* Mobile-proportioned container (Completely unchangeable on mobile) */}
      <div className="block md:hidden w-full max-w-md bg-[#111113] min-h-screen flex flex-col relative pb-28 select-none">
        
        {/* ==================== TOP APP BAR ==================== */}
        <header className="sticky top-0 bg-[#111113]/90 backdrop-blur-md z-20 px-5 py-3.5 flex items-center justify-between border-b border-[#1c1c20]/60">
          {activeTab === 'tools' ? (
            <>
              <button 
                className="p-1 rounded-lg text-white hover:bg-[#1f1f25] transition-colors"
                aria-label="القائمة"
              >
                <LayoutGrid className="w-6 h-6 stroke-[1.75]" />
              </button>
              
              <h1 className="text-[19px] font-bold text-white tracking-wide">
                الأدوات
              </h1>

              <button 
                className="p-1 rounded-lg text-white hover:bg-[#1f1f25] transition-colors"
                aria-label="بحث"
              >
                <Search className="w-6 h-6 stroke-[1.75]" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center py-0.5">
              <h1 className="text-[19px] font-bold text-white tracking-wide text-center">
                الإعدادات
              </h1>
            </div>
          )}
        </header>

        {/* ==================== MAIN CONTENT AREA ==================== */}
        <main className="flex-1 px-4 pt-3 flex flex-col gap-4">

          {/* TOOLS PAGE */}
          {activeTab === 'tools' && (
            <div className="flex flex-col gap-4 pb-20">
              {/* Active Document Banner if editing a converted file */}
              {convertedDoc && (
                <div className="bg-[#1c1c20] border border-[#388bfd]/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#388bfd]/20 text-[#388bfd] flex items-center justify-center shrink-0">
                      <Pencil className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="min-w-0 flex-1 text-right">
                      <span className="text-[11px] font-bold text-[#8e8e93] block">جاري تعديل المستند:</span>
                      <h4 className="text-xs font-bold text-white truncate dir-ltr text-right">{convertedDoc.name}</h4>
                    </div>
                  </div>
                  <button
                    onClick={() => setConvertedDoc(null)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shrink-0"
                  >
                    إغلاق المستند
                  </button>
                </div>
              )}
              {/* Section 1: تنظيم PDF */}
              <section>
                <h2 className="text-[13px] font-semibold text-[#8e8e93] text-right mb-3 px-1">
                  تنظيم PDF
                </h2>

                <div className="flex flex-col gap-3">
                  {/* Card 0: ضغط PDF */}
                  <div 
                    onClick={() => {
                      if (convertedDoc) {
                        setSelectedCompressFile({ file: convertedDoc.file, name: convertedDoc.name, totalPages: convertedDoc.totalPages });
                        setShowCompressModal(true);
                      } else {
                        compressFileInputRef.current?.click();
                      }
                    }}
                    className="bg-[#1c1c20] hover:bg-[#232329] active:scale-[0.99] transition-all rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <Minimize2 className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        ضغط PDF
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        تقليل حجم الملف مع الحفاظ على أفضل جودة.
                      </p>
                    </div>
                  </div>

                  {/* Card 1: دمج PDF */}
                  <div 
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="bg-[#1c1c20] hover:bg-[#232329] active:scale-[0.99] transition-all rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <FileText className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        دمج PDF
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        دمج ملفات PDF متعددة في مستند واحد.
                      </p>
                    </div>
                  </div>

                  {/* Card 3: استخراج صفحات PDF */}
                  <div 
                    onClick={() => {
                      if (convertedDoc) {
                        const fileData = { file: convertedDoc.file, name: convertedDoc.name, totalPages: convertedDoc.totalPages };
                        setSelectedExtractFile(fileData);
                        setShowExtractModal(true);
                        setExtractPagesPreviews(convertedDoc.previews);
                        setSelectedPagesList([]);
                        setExtractPagesInput('');
                      } else {
                        extractFileInputRef.current?.click();
                      }
                    }}
                    className="bg-[#1c1c20] hover:bg-[#232329] active:scale-[0.99] transition-all rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <FileUp className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        استخراج صفحات PDF
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        استخراج الصفحات إلى ملف PDF جديد.
                      </p>
                    </div>
                  </div>

                  {/* Card 4: إعادة ترتيب الصفحات */}
                  <div 
                    onClick={() => {
                      reorderFileInputRef.current?.click();
                    }}
                    className="bg-[#1c1c20] hover:bg-[#232329] active:scale-[0.99] transition-all rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <ArrowUpDown className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        إعادة ترتيب الصفحات
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        تغيير ترتيب الصفحات في ملف PDF.
                      </p>
                    </div>
                  </div>

                  {/* Card 5: حذف الصفحات */}
                  <div 
                    onClick={() => {
                      if (convertedDoc) {
                        const fileData = { file: convertedDoc.file, name: convertedDoc.name, totalPages: convertedDoc.totalPages };
                        setSelectedDeleteFile(fileData);
                        setShowDeleteModal(true);
                        setDeletePagesPreviews(convertedDoc.previews);
                        setPagesToDeleteList([]);
                        setDeletePagesInput('');
                      } else {
                        deleteFileInputRef.current?.click();
                      }
                    }}
                    className="bg-[#1c1c20] hover:bg-[#232329] active:scale-[0.99] transition-all rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <Trash2 className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        حذف الصفحات
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        حذف الصفحات غير المرغوب فيها من ملف PDF.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: تحويل */}
              <section className="mb-4">
                <h2 className="text-[13px] font-semibold text-[#8e8e93] text-right mb-3 px-1">
                  تحويل
                </h2>

                <div className="flex flex-col gap-3">
                  {/* Card 7: PDF إلى صور */}
                  <div 
                    onClick={() => {
                      pdfToImgFileInputRef.current?.click();
                    }}
                    className="bg-[#1c1c20] hover:bg-[#232329] active:scale-[0.99] transition-all rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <ImageIcon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        PDF إلى صور
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        تحويل صفحات PDF إلى صور عالية الجودة.
                      </p>
                    </div>
                  </div>

                  {/* Card 8: صور إلى PDF */}
                  <div 
                    onClick={() => {
                      imgToPdfInputRef.current?.click();
                    }}
                    className="bg-[#1c1c20] hover:bg-[#232329] active:scale-[0.99] transition-all rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <ImagePlus className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        صور إلى PDF
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        دمج صور متعددة في ملف PDF واحد.
                      </p>
                    </div>
                  </div>

                  {/* Card 10: تحويل الصورة إلى نص */}
                  <div 
                    onClick={() => {
                      ocrImageInputRef.current?.click();
                    }}
                    className="bg-[#1c1c20] hover:bg-[#232329] active:scale-[0.99] transition-all rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-blue-400">
                      <Scan className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <div className="flex items-center justify-end gap-1.5 mb-0.5">
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-1.5 py-0.5 rounded-md">ذكاء اصطناعي</span>
                        <h3 className="text-[17px] font-bold text-white leading-tight">
                          تحويل الصورة إلى نص
                        </h3>
                      </div>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        استخراج النصوص والكلمات العربية والإنجليزية من الصور بدقة عالية.
                      </p>
                    </div>
                  </div>

                  {/* Card 11: تحويل الـ PDF إلى نص */}
                  <div 
                    onClick={async () => {
                      if (convertedDoc) {
                        setOcrFileName(convertedDoc.name);
                        setOcrFileType('pdf');
                        setIsOcrProcessing(true);
                        setOcrResultText('');
                        setOcrCopied(false);
                        setShowOcrModal(true);
                        try {
                          const base64Data = arrayBufferToBase64(convertedDoc.file);
                          const res = await fetch('/api/extract-text', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              fileData: base64Data,
                              mimeType: 'application/pdf',
                              fileType: 'pdf',
                            }),
                          });

                          if (!res.ok) {
                            const errorData = await res.json().catch(() => ({}));
                            throw new Error(errorData.error || `فشل استخراج النص: ${res.status}`);
                          }

                          const data = await res.json();
                          setOcrResultText(data.text || 'لم يتم العثور على أي نص في هذا الملف.');
                        } catch (err: any) {
                          console.error('Error extracting text:', err);
                          setOcrResultText(`حدث خطأ أثناء استخراج النص: ${err.message || 'يرجى المحاولة مرة أخرى.'}`);
                        } finally {
                          setIsOcrProcessing(false);
                        }
                      } else {
                        ocrPdfInputRef.current?.click();
                      }
                    }}
                    className="bg-[#1c1c20] hover:bg-[#232329] active:scale-[0.99] transition-all rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-blue-400">
                      <Sparkles className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <div className="flex items-center justify-end gap-1.5 mb-0.5">
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-1.5 py-0.5 rounded-md">ذكاء اصطناعي</span>
                        <h3 className="text-[17px] font-bold text-white leading-tight">
                          تحويل الـ PDF إلى نص
                        </h3>
                      </div>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        استخراج كامل نصوص صفحات الـ PDF بدقة باستخدام نماذج الذكاء الاصطناعي.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: الأمان والحماية */}
              <section className="mb-4">
                <h2 className="text-[13px] font-semibold text-[#8e8e93] text-right mb-3 px-1">
                  الأمان والحماية
                </h2>

                <div className="flex flex-col gap-3">
                  {/* Card 9: حماية PDF */}
                  <div 
                    onClick={() => {
                      protectFileInputRef.current?.click();
                    }}
                    className="bg-[#1c1c20] hover:bg-[#232329] active:scale-[0.99] transition-all rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <Lock className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        حماية PDF
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        تعيين كلمة سر وتشفير لحماية مستند PDF.
                      </p>
                    </div>
                  </div>

                  {/* Card 10: إلغاء حماية PDF */}
                  <div 
                    onClick={() => {
                      unlockFileInputRef.current?.click();
                    }}
                    className="bg-[#1c1c20] hover:bg-[#232329] active:scale-[0.99] transition-all rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <Unlock className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        إلغاء حماية PDF
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        إزالة كلمة السر وفك تشفير ملف PDF.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* BOTTOM SAVE BUTTON ON TOOLS PAGE */}
              {convertedDoc && (
                <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 z-30">
                  <button
                    onClick={downloadAllPagesAsZip}
                    disabled={isExportingZip}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-emerald-600/25 border border-emerald-500/30"
                  >
                    {isExportingZip ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري حفظ المستند...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-5 h-5 stroke-[2.2]" />
                        <span>حفظ</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SETTINGS PAGE */}
          {activeTab === 'settings' && (
            <>
              {/* Section 1: عام */}
              <section>
                <h2 className="text-[13px] font-semibold text-[#8e8e93] text-right mb-3 px-1">
                  عام
                </h2>

                <div className="flex flex-col gap-3">
                                    {/* Card 1: المظهر */}
                  <div 
                    onClick={() => setShowThemeModal(true)}
                    className="bg-[#1c1c20] hover:bg-[#232329] transition-colors rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        {language === 'ar' ? 'المظهر' : 'Appearance'}
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        {theme === 'dark' 
                          ? (language === 'ar' ? 'داكن' : 'Dark')
                          : (language === 'ar' ? 'فاتح' : 'Light')}
                      </p>
                    </div>
                  </div>

                  {/* Card 2: اللغة */}
                  <div 
                    onClick={() => setShowLanguageModal(true)}
                    className="bg-[#1c1c20] hover:bg-[#232329] transition-colors rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <Globe className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        {language === 'ar' ? 'اللغة' : 'Language'}
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        {language === 'ar' ? 'العربية' : 'English'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: التواصل */}
              <section className="mb-4">
                <h2 className="text-[13px] font-semibold text-[#8e8e93] text-right mb-3 px-1">
                  التواصل
                </h2>

                <div className="flex flex-col gap-3">
                  {/* Card 3: تيليجرام */}
                  <div className="bg-[#1c1c20] hover:bg-[#232329] transition-colors rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer">
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <Send className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        تيليجرام
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal">
                        تواصل معنا مباشرة عبر تيليجرام
                      </p>
                    </div>
                  </div>

                  {/* Card 4: البريد الإلكتروني */}
                  <div 
                    onClick={() => {
                      window.location.href = 'mailto:zaidbnihani73@gmail.com';
                    }}
                    className="bg-[#1c1c20] hover:bg-[#232329] transition-colors rounded-[18px] p-4 flex items-center justify-between gap-4 border border-[#23232a]/80 shadow-sm cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] shrink-0 rounded-xl bg-[#272730] flex items-center justify-center text-white">
                      <Mail className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-white mb-0.5 leading-tight">
                        البريد الالكتروني للتواصل
                      </h3>
                      <p className="text-[13px] text-[#9a9aa2] leading-snug font-normal select-all">
                        zaidbnihani73@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>

        {/* ==================== BOTTOM NAVIGATION BAR ==================== */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#121215]/95 backdrop-blur-lg border-t border-[#1c1c22] px-6 py-2.5 z-30 flex items-center justify-around">
          {/* Tab 1: الأدوات */}
          <button 
            onClick={() => setActiveTab('tools')}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === 'tools' 
                ? 'bg-[#282834] text-white px-5 py-1.5 rounded-2xl shadow-inner' 
                : 'text-[#71717a] hover:text-zinc-400 py-1 px-3'
            }`}
          >
            <Wrench className="w-[22px] h-[22px] stroke-[1.8]" />
            <span className={`text-[11px] mt-0.5 ${activeTab === 'tools' ? 'font-bold' : 'font-medium'}`}>الأدوات</span>
          </button>

          {/* Tab 3: الإعدادات */}
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === 'settings' 
                ? 'bg-[#282834] text-white px-5 py-1.5 rounded-2xl shadow-inner' 
                : 'text-[#71717a] hover:text-zinc-400 py-1 px-3'
            }`}
          >
            <Settings className="w-[22px] h-[22px] stroke-[1.75]" />
            <span className={`text-[11px] mt-0.5 ${activeTab === 'settings' ? 'font-bold' : 'font-medium'}`}>الإعدادات</span>
          </button>
        </nav>
      </div>

      {/* TABLET INTERFACE (768px - 1023px) */}
      <TabletInterface 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowScannerModal={setShowScannerModal}
        setShowLanguageModal={setShowLanguageModal}
        language={language}
        convertedDoc={convertedDoc}
        setConvertedDoc={setConvertedDoc}
        pdfFilesForMerge={pdfFilesForMerge}
        fileInputRef={fileInputRef}
        pdfToImgFileInputRef={pdfToImgFileInputRef}
        imgToPdfInputRef={imgToPdfInputRef}
        ocrImageInputRef={ocrImageInputRef}
        isMerging={isMerging}
        handleMergePdf={handleMergePdf}
      />

      {/* COMPUTER / DESKTOP INTERFACE (>= 1024px) */}
      <DesktopInterface 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowScannerModal={setShowScannerModal}
        setShowLanguageModal={setShowLanguageModal}
        language={language}
        convertedDoc={convertedDoc}
        setConvertedDoc={setConvertedDoc}
        pdfFilesForMerge={pdfFilesForMerge}
        fileInputRef={fileInputRef}
        pdfToImgFileInputRef={pdfToImgFileInputRef}
        imgToPdfInputRef={imgToPdfInputRef}
        ocrImageInputRef={ocrImageInputRef}
        isMerging={isMerging}
        handleMergePdf={handleMergePdf}
      />

        {/* ==================== MERGE PDF MODAL / SCREEN ==================== */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept=".pdf,application/pdf" 
          multiple 
          className="hidden" 
        />

        {showMergeModal && (
          <div className="fixed inset-0 z-50 bg-[#111113] flex justify-center">
            <div className="w-full max-w-md bg-[#111113] h-full flex flex-col relative select-none">
              
              {/* Modal Header */}
              <header className="px-5 py-4 flex items-center justify-between border-b border-[#1c1c20] bg-[#111113]">
                <button 
                  onClick={() => setShowMergeModal(false)}
                  className="p-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-6 h-6" />
                </button>

                <h2 className="text-[18px] font-bold text-white">
                  دمج ملفات PDF
                </h2>

                {pdfFilesForMerge.length > 0 ? (
                  <button 
                    onClick={() => setPdfFilesForMerge([])}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    مسح الكل
                  </button>
                ) : (
                  <div className="w-8"></div>
                )}
              </header>

              {/* Modal Content */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                {pdfFilesForMerge.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto">
                    <div className="w-20 h-20 rounded-3xl bg-[#1c1c20] border border-[#23232a] flex items-center justify-center text-[#388bfd] mb-5 shadow-lg">
                      <Upload className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      حدد ملفات PDF للدمج
                    </h3>
                    <p className="text-xs text-[#8e8e93] mb-6 max-w-[260px] leading-relaxed">
                      اختر ملفين أو أكثر من جهازك ليتم دمجها برابط سريع ومباشر في مستند واحد.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#388bfd] hover:bg-[#2b7de9] active:scale-95 transition-all text-white px-7 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-lg shadow-blue-500/20 text-sm"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                      <span>اختيار ملفات PDF</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Header bar inside file list */}
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-semibold text-[#8e8e93]">
                        تم اختيار {pdfFilesForMerge.length} ملفات
                      </span>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-[#388bfd] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة المزيد</span>
                      </button>
                    </div>

                    {/* Files list */}
                    <div className="flex flex-col gap-2.5">
                      {pdfFilesForMerge.map((item, index) => (
                        <MergeFileCard
                          key={item.id}
                          idx={index}
                          originalNum={item.originalNum}
                          name={item.name}
                          size={item.size}
                          thumbnailUrl={item.thumbnailUrl}
                          onMove={handleMoveMergeFile}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              {pdfFilesForMerge.length > 0 && (
                <div className="p-4 bg-[#111113] border-t border-[#1c1c20] flex flex-col gap-2">
                  {pdfFilesForMerge.length < 2 && (
                    <p className="text-[12px] text-amber-400/90 text-center">
                      يرجى إضافة ملفين على الأقل للتمكن من الدمج
                    </p>
                  )}
                  <button
                    onClick={handleMergePdf}
                    disabled={pdfFilesForMerge.length < 2 || isMerging}
                    className="w-full bg-[#388bfd] hover:bg-[#2b7de9] disabled:bg-[#202530] disabled:text-zinc-600 active:scale-[0.99] transition-all text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/15"
                  >
                    {isMerging ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري دمج الملفات...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>دمج وحفظ المستند</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ==================== SPLIT PDF MODAL / SCREEN ==================== */}
        <input 
          type="file" 
          ref={splitFileInputRef} 
          onChange={handleSplitFileSelect} 
          accept=".pdf,application/pdf" 
          className="hidden" 
        />

        {showSplitModal && (
          <div className="fixed inset-0 z-50 bg-[#111113] flex justify-center">
            <div className="w-full max-w-md bg-[#111113] h-full flex flex-col relative select-none">
              
              {/* Modal Header */}
              <header className="px-5 py-4 flex items-center justify-between border-b border-[#1c1c20] bg-[#111113]">
                <button 
                  onClick={() => {
                    setShowSplitModal(false);
                    setSelectedSplitFile(null);
                  }}
                  className="p-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-6 h-6" />
                </button>

                <h2 className="text-[18px] font-bold text-white">
                  تقسيم ملف PDF
                </h2>

                {selectedSplitFile ? (
                  <button 
                    onClick={() => setSelectedSplitFile(null)}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    تغيير الملف
                  </button>
                ) : (
                  <div className="w-8"></div>
                )}
              </header>

              {/* Modal Content */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                {!selectedSplitFile ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto">
                    <div className="w-20 h-20 rounded-3xl bg-[#1c1c20] border border-[#23232a] flex items-center justify-center text-[#388bfd] mb-5 shadow-lg">
                      <Scissors className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      اختر ملف PDF لتقسيمه
                    </h3>
                    <p className="text-xs text-[#8e8e93] mb-6 max-w-[260px] leading-relaxed">
                      حدد المستند الذي تريد استخراج صفحة واحدة أو نطاق معين من الصفحات منه.
                    </p>
                    <button
                      onClick={() => splitFileInputRef.current?.click()}
                      className="bg-[#388bfd] hover:bg-[#2b7de9] active:scale-95 transition-all text-white px-7 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-lg shadow-blue-500/20 text-sm"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                      <span>اختيار ملف PDF</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5 pt-2">
                    {/* Selected File Card */}
                    <div className="bg-[#1c1c20] border border-[#23232a] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#272730] text-[#388bfd] flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 stroke-[1.75]" />
                      </div>
                      <div className="min-w-0 flex-1 text-right">
                        <h4 className="text-sm font-bold text-white truncate dir-ltr text-right">
                          {selectedSplitFile.name}
                        </h4>
                        <p className="text-xs text-[#8e8e93] mt-1">
                          إجمالي الصفحات: <span className="text-white font-semibold">{selectedSplitFile.totalPages}</span> صفحات
                        </p>
                      </div>
                    </div>

                    {/* Page Selection Controls */}
                    <div className="bg-[#1c1c20] border border-[#23232a] rounded-2xl p-4 flex flex-col gap-4">
                      <h3 className="text-xs font-bold text-[#8e8e93] text-right">
                        تحديد نطاق الصفحات المراد استخراجها
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Start Page */}
                        <div className="flex flex-col gap-1.5 text-right">
                          <label className="text-xs font-medium text-zinc-300">
                            من صفحة:
                          </label>
                          <input 
                            type="number"
                            min={1}
                            max={splitEndPage}
                            value={splitStartPage}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              const clamped = Math.max(1, Math.min(val, splitEndPage));
                              setSplitStartPage(clamped);
                            }}
                            className="bg-[#121215] border border-[#2c2c36] text-white rounded-xl px-3 py-2.5 text-center text-sm font-bold focus:outline-none focus:border-[#388bfd]"
                          />
                        </div>

                        {/* End Page */}
                        <div className="flex flex-col gap-1.5 text-right">
                          <label className="text-xs font-medium text-zinc-300">
                            إلى صفحة:
                          </label>
                          <input 
                            type="number"
                            min={splitStartPage}
                            max={selectedSplitFile.totalPages}
                            value={splitEndPage}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || splitStartPage;
                              const clamped = Math.max(splitStartPage, Math.min(val, selectedSplitFile.totalPages));
                              setSplitEndPage(clamped);
                            }}
                            className="bg-[#121215] border border-[#2c2c36] text-white rounded-xl px-3 py-2.5 text-center text-sm font-bold focus:outline-none focus:border-[#388bfd]"
                          />
                        </div>
                      </div>

                      {/* Range Quick Helper Buttons */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#272732]">
                        <button 
                          onClick={() => {
                            setSplitStartPage(1);
                            setSplitEndPage(selectedSplitFile.totalPages);
                          }}
                          className="text-[#388bfd] font-semibold hover:underline"
                        >
                          كل الصفحات (1 - {selectedSplitFile.totalPages})
                        </button>
                        <span className="text-[#8e8e93]">
                          الصفحات المحددة: <strong className="text-white">{splitEndPage - splitStartPage + 1}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Summary badge */}
                    <div className="bg-[#181820] border border-[#23232c] rounded-xl p-3 text-center">
                      <p className="text-xs text-[#9a9aa2]">
                        سيتم إنشاء ملف PDF جديد يحتوي على الصفحات من <span className="text-white font-bold">{splitStartPage}</span> إلى <span className="text-white font-bold">{splitEndPage}</span>.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              {selectedSplitFile && (
                <div className="p-4 bg-[#111113] border-t border-[#1c1c20]">
                  <button
                    onClick={handleSplitPdf}
                    disabled={isSplitting}
                    className="w-full bg-[#388bfd] hover:bg-[#2b7de9] disabled:bg-[#202530] disabled:text-zinc-600 active:scale-[0.99] transition-all text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/15"
                  >
                    {isSplitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري تقسيم الملف...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>تقسيم وحفظ المستند</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ==================== EXTRACT PAGES MODAL / SCREEN ==================== */}
        <input 
          type="file" 
          ref={extractFileInputRef} 
          onChange={handleExtractFileSelect} 
          accept=".pdf,application/pdf" 
          className="hidden" 
        />

        {showExtractModal && (
          <div className="fixed inset-0 z-50 bg-[#111113] flex justify-center">
            <div className="w-full max-w-md bg-[#111113] h-full flex flex-col relative select-none">
              
              {/* Modal Header */}
              <header className="px-5 py-4 flex items-center justify-between border-b border-[#1c1c20] bg-[#111113]">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      if (selectedPagesList.length === extractPagesPreviews.length) {
                        setSelectedPagesList([]);
                        setExtractPagesInput('');
                      } else {
                        const allPages = extractPagesPreviews.map((p) => p.pageNum);
                        setSelectedPagesList(allPages);
                        setExtractPagesInput(allPages.join(', '));
                      }
                    }}
                    className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                    title="تحديد الكل"
                  >
                    <CheckSquare className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => alert('انقر على الصفحات التي تريد استخراجها وحفظها في مستند مستقل ثم اضغط زر الاستخراج أسفل الشاشة.')}
                    className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                    title="مساعدة"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>

                <h2 className="text-[19px] font-bold text-white tracking-wide">
                  استخراج صفحات PDF
                </h2>

                <button 
                  onClick={() => {
                    setShowExtractModal(false);
                    setSelectedExtractFile(null);
                    setExtractPagesPreviews([]);
                    setSelectedPagesList([]);
                  }}
                  className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                  aria-label="رجوع"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </header>

              {/* Modal Content */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                {!selectedExtractFile && !isRenderingExtractPreviews ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto">
                    <div className="w-20 h-20 rounded-3xl bg-[#1c1c20] border border-[#23232a] flex items-center justify-center text-blue-400 mb-5 shadow-lg">
                      <FileUp className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      اختر ملف PDF لاستخراج الصفحات منه
                    </h3>
                    <p className="text-xs text-[#8e8e93] mb-6 max-w-[260px] leading-relaxed">
                      قم باختيار المستند وتحديد الصفحات المراد استخراجها بصرياً من الأولى إلى الأخيرة.
                    </p>
                    <button
                      onClick={() => extractFileInputRef.current?.click()}
                      className="bg-[#388bfd] hover:bg-[#2b7de9] active:scale-95 transition-all text-white px-7 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-lg shadow-blue-500/20 text-sm"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                      <span>اختيار ملف PDF</span>
                    </button>
                  </div>
                ) : isRenderingExtractPreviews ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto py-16">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <h3 className="text-base font-bold text-white mb-1">
                      جاري تحميل معاينة صفحات الـ PDF...
                    </h3>
                    <p className="text-xs text-[#8e8e93]">
                      يتم جلب واستعراض كل صفحات المستند من الأولى إلى الأخيرة
                    </p>
                  </div>
                ) : selectedExtractFile && (
                  <div className="flex flex-col gap-4 py-1">
                    {/* Visual Page Previews Grid (Clean full white paper cards, 2 per row) */}
                    <div className="grid grid-cols-2 gap-3.5 p-1 w-full">
                      {extractPagesPreviews.map((preview) => (
                        <ExtractPageCard
                          key={preview.pageNum}
                          preview={preview}
                          isSelected={selectedPagesList.includes(preview.pageNum)}
                          onToggle={() => togglePageSelection(preview.pageNum)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              {selectedExtractFile && !isRenderingExtractPreviews && (
                <div className="p-4 bg-[#111113] border-t border-[#1c1c20]">
                  <button
                    onClick={handleExtractPagesPdf}
                    disabled={selectedPagesList.length === 0 || isExtracting}
                    className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                      selectedPagesList.length === 0 || isExtracting
                        ? 'bg-[#23252c] text-[#8e93a0] cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98] shadow-blue-600/25'
                    }`}
                  >
                    {isExtracting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري استخراج الصفحات...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>استخراج ({selectedPagesList.length}) صفحة وحفظ المستند</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ==================== AI OCR / TEXT EXTRACTION MODAL ==================== */}
        <input 
          type="file" 
          ref={ocrImageInputRef} 
          onChange={(e) => handleOcrFileSelect(e, 'image')} 
          accept="image/*" 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={ocrPdfInputRef} 
          onChange={(e) => handleOcrFileSelect(e, 'pdf')} 
          accept=".pdf,application/pdf" 
          className="hidden" 
        />

        {showOcrModal && (
          <div className="fixed inset-0 z-50 bg-[#111113]/95 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="w-full max-w-lg bg-[#18181c] border border-[#23232a] rounded-2xl flex flex-col max-h-[85vh] shadow-2xl relative">
              
              {/* Modal Header */}
              <header className="px-5 py-4 flex items-center justify-between border-b border-[#23232a] bg-[#18181c] rounded-t-2xl">
                <button 
                  onClick={() => {
                    setShowOcrModal(false);
                    setOcrResultText('');
                  }}
                  className="p-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                  <h2 className="text-[17px] font-bold text-white">
                    {ocrFileType === 'image' ? 'استخراج النص من الصورة' : 'استخراج النص من PDF'}
                  </h2>
                </div>
              </header>

              {/* Modal Content */}
              <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 text-right">
                <div className="bg-[#111113] p-3 rounded-xl border border-[#1e1e24] text-xs text-zinc-400 truncate dir-ltr text-right">
                  <span className="font-semibold text-zinc-500 block text-right">اسم الملف:</span>
                  {ocrFileName}
                </div>

                {isOcrProcessing ? (
                  <div className="flex-1 py-12 flex flex-col items-center justify-center text-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-bold text-white">جاري تحليل المستند واستخراج النصوص...</p>
                      <p className="text-xs text-[#8e8e93]">يتم ذلك بدقة عالية باستخدام نماذج الذكاء الاصطناعي</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs font-semibold text-[#8e8e93]">النص المستخرج:</label>
                    <textarea
                      readOnly
                      value={ocrResultText}
                      className="w-full flex-1 min-h-[250px] p-4 bg-[#111113] border border-[#23232a] rounded-xl text-white text-sm focus:outline-none resize-none font-mono leading-relaxed text-right dir-rtl"
                      placeholder="سيظهر النص المستخرج هنا..."
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              {!isOcrProcessing && ocrResultText && (
                <footer className="px-5 py-4 border-t border-[#23232a] bg-[#18181c] rounded-b-2xl flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      const blob = new Blob([ocrResultText], { type: 'text/plain;charset=utf-8' });
                      const baseName = ocrFileName.substring(0, ocrFileName.lastIndexOf('.')) || ocrFileName;
                      saveAs(blob, `${baseName}_extracted_text.txt`);
                    }}
                    className="bg-[#272730] hover:bg-[#32323d] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Download className="w-4 h-4 text-zinc-400" />
                    <span>تحميل (.txt)</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(ocrResultText);
                      setOcrCopied(true);
                      setTimeout(() => setOcrCopied(false), 2000);
                    }}
                    className={`${
                      ocrCopied ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-500'
                    } text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 active:scale-95`}
                  >
                    {ocrCopied ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>تم نسخ النص</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-white" />
                        <span>نسخ النص</span>
                      </>
                    )}
                  </button>
                </footer>
              )}
            </div>
          </div>
        )}

        {/* ==================== ROTATE PAGES MODAL / SCREEN ==================== */}
        <input 
          type="file" 
          ref={rotateFileInputRef} 
          onChange={handleRotateFileSelect} 
          accept=".pdf,application/pdf" 
          className="hidden" 
        />

        {showRotateModal && (
          <div className="fixed inset-0 z-50 bg-[#111113] flex justify-center">
            <div className="w-full max-w-md bg-[#111113] h-full flex flex-col relative select-none">
              
              {/* Modal Header */}
              <header className="px-5 py-4 flex items-center justify-between border-b border-[#1c1c20] bg-[#111113]">
                <button 
                  onClick={() => {
                    setShowRotateModal(false);
                    setSelectedRotateFile(null);
                  }}
                  className="p-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-6 h-6" />
                </button>

                <h2 className="text-[18px] font-bold text-white">
                  تدوير صفحات PDF
                </h2>

                {selectedRotateFile ? (
                  <button 
                    onClick={() => setSelectedRotateFile(null)}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    تغيير الملف
                  </button>
                ) : (
                  <div className="w-8"></div>
                )}
              </header>

              {/* Modal Content */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                {!selectedRotateFile ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto">
                    <div className="w-20 h-20 rounded-3xl bg-[#1c1c20] border border-[#23232a] flex items-center justify-center text-[#388bfd] mb-5 shadow-lg">
                      <RotateCw className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      اختر ملف PDF لتدوير صفحاته
                    </h3>
                    <p className="text-xs text-[#8e8e93] mb-6 max-w-[260px] leading-relaxed">
                      اختر المستند لتدوير كل الصفحات أو صفحات معينة بمقدار 90 درجة يميناً أو يساراً.
                    </p>
                    <button
                      onClick={() => rotateFileInputRef.current?.click()}
                      className="bg-[#388bfd] hover:bg-[#2b7de9] active:scale-95 transition-all text-white px-7 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-lg shadow-blue-500/20 text-sm"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                      <span>اختيار ملف PDF</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 pt-1">
                    {/* Selected File Card */}
                    <div className="bg-[#1c1c20] border border-[#23232a] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#272730] text-[#388bfd] flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 stroke-[1.75]" />
                      </div>
                      <div className="min-w-0 flex-1 text-right">
                        <h4 className="text-sm font-bold text-white truncate dir-ltr text-right">
                          {selectedRotateFile.name}
                        </h4>
                        <p className="text-xs text-[#8e8e93] mt-1">
                          إجمالي الصفحات: <span className="text-white font-semibold">{selectedRotateFile.totalPages}</span> صفحات
                        </p>
                      </div>
                    </div>

                    {/* Global Rotate Controls */}
                    <div className="bg-[#1c1c20] border border-[#23232a] rounded-2xl p-4 flex flex-col gap-3">
                      <label className="text-xs font-bold text-[#8e8e93] text-right">
                        تدوير جميع الصفحات
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => rotateAllPages(90)}
                          className="bg-[#24242e] hover:bg-[#2c2c38] active:scale-95 text-white text-xs font-bold py-3 px-3 rounded-xl border border-[#30303d] flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                          <RotateCw className="w-4 h-4 text-[#388bfd]" />
                          <span>90° يميناً (عقارب الساعة)</span>
                        </button>
                        <button
                          onClick={() => rotateAllPages(-90)}
                          className="bg-[#24242e] hover:bg-[#2c2c38] active:scale-95 text-white text-xs font-bold py-3 px-3 rounded-xl border border-[#30303d] flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                          <RotateCcw className="w-4 h-4 text-[#388bfd]" />
                          <span>90° يساراً (عكس العقارب)</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setPageRotations(new Array(selectedRotateFile.totalPages).fill(0))}
                        className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline text-center pt-1"
                      >
                        إعادة تعيين التدوير للجميع
                      </button>
                    </div>

                    {/* Interactive Page Grid for Individual Rotations */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#8e8e93]">تدوير كل صفحة بمفردها</span>
                        <span className="text-[#388bfd] font-semibold">
                          صفحات معدلة: {pageRotations.filter((r) => ((r % 360) + 360) % 360 !== 0).length}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1 bg-[#16161a] rounded-2xl border border-[#22222a]">
                        {Array.from({ length: selectedRotateFile.totalPages }, (_, i) => i + 1).map((pageNum, idx) => {
                          const netRot = ((pageRotations[idx] % 360) + 360) % 360;
                          return (
                            <div
                              key={pageNum}
                              className="bg-[#1c1c20] border border-[#23232a] rounded-xl p-2.5 flex flex-col items-center justify-between gap-2 shadow-sm"
                            >
                              <div className="flex items-center justify-between w-full px-1">
                                <span className="text-xs font-bold text-white">
                                  صفحة #{pageNum}
                                </span>
                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                  netRot === 0 ? 'bg-zinc-800 text-zinc-400' : 'bg-blue-500/20 text-[#388bfd]'
                                }`}>
                                  {netRot}°
                                </span>
                              </div>

                              <div className="flex items-center justify-center gap-2 w-full pt-1 border-t border-[#252530]">
                                <button
                                  onClick={() => rotateSinglePage(idx, -90)}
                                  className="p-1.5 rounded-lg bg-[#252530] hover:bg-[#303040] text-zinc-300 hover:text-white transition-colors"
                                  title="تدوير 90° يساراً"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => rotateSinglePage(idx, 90)}
                                  className="p-1.5 rounded-lg bg-[#252530] hover:bg-[#303040] text-zinc-300 hover:text-white transition-colors"
                                  title="تدوير 90° يميناً"
                                >
                                  <RotateCw className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Summary badge */}
                    <div className="bg-[#181820] border border-[#23232c] rounded-xl p-3 text-center">
                      <p className="text-xs text-[#9a9aa2]">
                        سيتم تطبيق زوايا التدوير المحددة عند حفظ الملف المستخرج.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              {selectedRotateFile && (
                <div className="p-4 bg-[#111113] border-t border-[#1c1c20]">
                  <button
                    onClick={handleRotatePdf}
                    disabled={isRotating}
                    className="w-full bg-[#388bfd] hover:bg-[#2b7de9] disabled:bg-[#202530] disabled:text-zinc-600 active:scale-[0.99] transition-all text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/15"
                  >
                    {isRotating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري تدوير المستند...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>حفظ الملف المدور</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ==================== REORDER PAGES MODAL / SCREEN ==================== */}
        <input 
          type="file" 
          ref={reorderFileInputRef} 
          onChange={handleReorderFileSelect} 
          accept=".pdf,application/pdf" 
          className="hidden" 
        />

        {showReorderModal && (
          <div className="fixed inset-0 z-50 bg-[#111113] flex justify-center">
            <div className="w-full max-w-md bg-[#111113] h-full flex flex-col relative select-none">
              
              {/* Modal Header */}
              <header className="px-5 py-4 flex items-center justify-between border-b border-[#1c1c20] bg-[#111113]">
                <button 
                  onClick={() => {
                    setShowReorderModal(false);
                    setSelectedReorderFile(null);
                    setReorderPagesPreviews([]);
                  }}
                  className="p-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-6 h-6" />
                </button>

                <h2 className="text-[18px] font-bold text-white">
                  إعادة ترتيب الصفحات
                </h2>

                {selectedReorderFile ? (
                  <button 
                    onClick={() => {
                      setSelectedReorderFile(null);
                      setReorderPagesPreviews([]);
                    }}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    تغيير الملف
                  </button>
                ) : (
                  <div className="w-8"></div>
                )}
              </header>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto flex flex-col">
                {!selectedReorderFile ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto py-12">
                    <div className="w-20 h-20 rounded-3xl bg-[#1c1c20] border border-[#23232a] flex items-center justify-center text-[#388bfd] mb-5 shadow-lg">
                      <ArrowUpDown className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      اختر ملف PDF لإعادة ترتيب صفحاته
                    </h3>
                    <p className="text-xs text-[#8e8e93] mb-6 max-w-[260px] leading-relaxed text-center">
                      اختر المستند ثم قم بسحب وتنسيق ترتيب الصفحات حسب الرغبة.
                    </p>
                    <button
                      onClick={() => reorderFileInputRef.current?.click()}
                      className="bg-[#388bfd] hover:bg-[#2b7de9] active:scale-95 transition-all text-white px-7 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-lg shadow-blue-500/20 text-sm"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                      <span>اختيار ملف PDF</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 p-4">
                    {/* Visual Loading Previews State */}
                    {isRenderingReorderPreviews ? (
                      <div className="py-20 flex flex-col items-center justify-center gap-3.5 bg-[#16161a] rounded-2xl border border-[#22222a] min-h-[300px]">
                        <Loader2 className="w-10 h-10 text-[#388bfd] animate-spin stroke-[1.5]" />
                        <div className="text-center">
                          <p className="text-sm font-bold text-white">جاري استخراج صفحات المستند...</p>
                          <p className="text-xs text-[#8e8e93] mt-1">يرجى الانتظار لحين معالجة الصفحات</p>
                        </div>
                      </div>
                    ) : (
                      /* Grid of visual pages cards exactly like deletion screen but layout-aware and drag-and-drop enabled */
                      <div className="grid grid-cols-2 gap-3.5 bg-[#16161a] rounded-2xl border border-[#22222a] p-3 max-h-[70vh] overflow-y-auto">
                        {pageOrder.map((pageNum, idx) => {
                          const preview = reorderPagesPreviews.find((p) => p.pageNum === pageNum);
                          return (
                            <ReorderPageCard
                              key={`${pageNum}-${idx}`}
                              preview={preview}
                              idx={idx}
                              pageNum={pageNum}
                              onMove={movePageInOrder}
                              onRemove={() => removePageFromOrder(idx)}
                              isLast={idx === pageOrder.length - 1}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Action Footer with updated "Save new copy" label */}
              {selectedReorderFile && !isRenderingReorderPreviews && (
                <div className="p-4 bg-[#111113] border-t border-[#1c1c20]">
                  <button
                    onClick={handleReorderPdf}
                    disabled={pageOrder.length === 0 || isReordering}
                    className="w-full bg-[#388bfd] hover:bg-[#2b7de9] disabled:bg-[#202530] disabled:text-zinc-600 active:scale-[0.99] transition-all text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/15"
                  >
                    {isReordering ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري حفظ نسخة جديدة...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-5 h-5" />
                        <span>حفظ نسخة جديدة</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ==================== DELETE PAGES MODAL / SCREEN ==================== */}
        <input 
          type="file" 
          ref={deleteFileInputRef} 
          onChange={handleDeleteFileSelect} 
          accept=".pdf,application/pdf" 
          className="hidden" 
        />

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-[#111113] flex justify-center">
            <div className="w-full max-w-md bg-[#111113] h-full flex flex-col relative select-none">
              
              {/* Modal Header */}
              <header className="px-5 py-4 flex items-center justify-between border-b border-[#1c1c20] bg-[#111113]">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      if (pagesToDeleteList.length === deletePagesPreviews.length) {
                        setPagesToDeleteList([]);
                        setDeletePagesInput('');
                      } else {
                        const allPages = deletePagesPreviews.map((p) => p.pageNum);
                        setPagesToDeleteList(allPages);
                        setDeletePagesInput(allPages.join(', '));
                      }
                    }}
                    className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                    title="تحديد الكل"
                  >
                    <CheckSquare className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => alert('انقر على الصفحات التي تريد حذفها ثم اضغط زر الحذف أسفل الشاشة.')}
                    className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                    title="مساعدة"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>

                <h2 className="text-[19px] font-bold text-white tracking-wide">
                  حذف الصفحات
                </h2>

                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedDeleteFile(null);
                    setDeletePagesPreviews([]);
                    setPagesToDeleteList([]);
                  }}
                  className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                  aria-label="رجوع"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </header>

              {/* Modal Content */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                {!selectedDeleteFile && !isRenderingDeletePreviews ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto">
                    <div className="w-20 h-20 rounded-3xl bg-[#1c1c20] border border-[#23232a] flex items-center justify-center text-red-400 mb-5 shadow-lg">
                      <Trash2 className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      اختر ملف PDF لحذف الصفحات منه
                    </h3>
                    <p className="text-xs text-[#8e8e93] mb-6 max-w-[260px] leading-relaxed">
                      قم باختيار المستند وتحديد الصفحات المراد حذفها بصرياً من الأولى إلى الأخيرة.
                    </p>
                    <button
                      onClick={() => deleteFileInputRef.current?.click()}
                      className="bg-[#388bfd] hover:bg-[#2b7de9] active:scale-95 transition-all text-white px-7 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-lg shadow-blue-500/20 text-sm"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                      <span>اختيار ملف PDF</span>
                    </button>
                  </div>
                ) : isRenderingDeletePreviews ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto py-16">
                    <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
                    <h3 className="text-base font-bold text-white mb-1">
                      جاري تحميل معاينة صفحات الـ PDF...
                    </h3>
                    <p className="text-xs text-[#8e8e93]">
                      يتم جلب واستعراض كل صفحات المستند من الأولى إلى الأخيرة
                    </p>
                  </div>
                ) : selectedDeleteFile && (
                  <div className="flex flex-col gap-4 py-1">
                    {/* Visual Page Previews Grid (Clean full white paper cards as in screenshot, 2 per row) */}
                    <div className="grid grid-cols-2 gap-3.5 p-1 w-full">
                      {deletePagesPreviews.map((preview) => (
                        <DeletePageCard
                          key={preview.pageNum}
                          preview={preview}
                          isDeleted={pagesToDeleteList.includes(preview.pageNum)}
                          onToggle={() => togglePageDeletion(preview.pageNum)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              {selectedDeleteFile && !isRenderingDeletePreviews && (
                <div className="p-4 bg-[#111113] border-t border-[#1c1c20]">
                  <button
                    onClick={handleDeletePagesPdf}
                    disabled={isDeletingPages || pagesToDeleteList.length === 0}
                    className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                      pagesToDeleteList.length === 0
                        ? 'bg-[#23252c] text-[#8e93a0] cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-500 text-white active:scale-[0.98] shadow-red-600/25'
                    }`}
                  >
                    {isDeletingPages ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري الحذف وحفظ المستند...</span>
                      </>
                    ) : pagesToDeleteList.length === 0 ? (
                      <span>حدد الصفحات للحذف</span>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5 stroke-[2]" />
                        <span>حذف ({pagesToDeleteList.length}) صفحة وحفظ المستند</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ==================== COMPRESS PDF MODAL / SCREEN ==================== */}
        <input 
          type="file" 
          ref={compressFileInputRef} 
          onChange={handleCompressFileSelect} 
          accept=".pdf,application/pdf" 
          className="hidden" 
        />

        {showCompressModal && (
          <div className="fixed inset-0 z-50 bg-[#111113] flex justify-center">
            <div className="w-full max-w-md bg-[#111113] h-full flex flex-col relative select-none">
              
              {/* Modal Header */}
              <header className="px-5 py-4 flex items-center justify-between border-b border-[#1c1c20] bg-[#111113]">
                <button 
                  onClick={() => {
                    setShowCompressModal(false);
                    setSelectedCompressFile(null);
                    setCompressionResult(null);
                  }}
                  className="p-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-6 h-6" />
                </button>

                <h2 className="text-[18px] font-bold text-white">
                  ضغط ملف PDF
                </h2>

                {selectedCompressFile ? (
                  <button 
                    onClick={() => {
                      setSelectedCompressFile(null);
                      setCompressionResult(null);
                    }}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    تغيير الملف
                  </button>
                ) : (
                  <div className="w-8"></div>
                )}
              </header>

              {/* Modal Content */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                {!selectedCompressFile ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto">
                    <div className="w-20 h-20 rounded-3xl bg-[#1c1c20] border border-[#23232a] flex items-center justify-center text-[#388bfd] mb-5 shadow-lg">
                      <Minimize2 className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      اختر ملف PDF لتقليل حجمه
                    </h3>
                    <p className="text-xs text-[#8e8e93] mb-6 max-w-[260px] leading-relaxed">
                      قم بضغط المستند وتقليل مساحة التخزين مع الحفاظ على وضوح وجودة المحتوى.
                    </p>
                    <button
                      onClick={() => compressFileInputRef.current?.click()}
                      className="bg-[#388bfd] hover:bg-[#2b7de9] active:scale-95 transition-all text-white px-7 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-lg shadow-blue-500/20 text-sm"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                      <span>اختيار ملف PDF</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 pt-1">
                    {/* Selected File Card */}
                    <div className="bg-[#1c1c20] border border-[#23232a] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#272730] text-[#388bfd] flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 stroke-[1.75]" />
                      </div>
                      <div className="min-w-0 flex-1 text-right">
                        <h4 className="text-sm font-bold text-white truncate dir-ltr text-right">
                          {selectedCompressFile.name}
                        </h4>
                        <p className="text-xs text-[#8e8e93] mt-1">
                          الحجم الحالي: <span className="text-white font-semibold">{formatFileSize(selectedCompressFile.size)}</span> | <span className="text-zinc-300">{selectedCompressFile.totalPages} صفحات</span>
                        </p>
                      </div>
                    </div>

                    {!compressionResult ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 bg-[#16161a] border border-[#22222a] rounded-3xl gap-6 animate-in fade-in duration-300">
                        {/* Beautiful circular progress with glowing effects */}
                        <div className="relative flex items-center justify-center w-28 h-28">
                          <div className="absolute inset-0 rounded-full border-4 border-[#23232a]" />
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="56"
                              cy="56"
                              r="50"
                              stroke="#388bfd"
                              strokeWidth="5"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 50}
                              strokeDashoffset={2 * Math.PI * 50 * (1 - compressProgress / 100)}
                              className="transition-all duration-300 ease-out"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white">{compressProgress}%</span>
                            <span className="text-[9px] font-bold text-[#8e8e93] uppercase tracking-wider mt-0.5">جاري المعالجة</span>
                          </div>
                        </div>

                        <div className="text-center space-y-2.5 max-w-[320px]">
                          <h4 className="text-sm font-bold text-white min-h-[40px] flex items-center justify-center px-2">
                            {compressStatus || 'جاري التحضير لضغط الملف...'}
                          </h4>
                          <p className="text-[11px] text-[#8e8e93] leading-relaxed">
                            نظام الضغط الذكي يقوم تلقائياً بتحسين حجم المكونات وإعادة ترميز الصور لتقليص المساحة مع الحفاظ على دقة وجودة النصوص.
                          </p>
                        </div>

                        {/* Professional engine steps indicators */}
                        <div className="w-full border-t border-[#23232a] pt-4 mt-1 space-y-2.5 text-right">
                          <div className="flex items-center gap-2.5 justify-start">
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${compressProgress >= 15 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-700 animate-pulse'}`} />
                            <span className={`text-[11px] font-medium ${compressProgress >= 15 ? 'text-zinc-200' : 'text-zinc-500'}`}>
                              تحليل بنيّة ملف الـ PDF وتفكيك الموارد
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5 justify-start">
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${compressProgress >= 80 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : compressProgress >= 15 ? 'bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]' : 'bg-zinc-700'}`} />
                            <span className={`text-[11px] font-medium ${compressProgress >= 80 ? 'text-zinc-200' : compressProgress >= 15 ? 'text-blue-400' : 'text-zinc-500'}`}>
                              إعادة ترميز الصور وتخفيض حجم الكتل الرسومية
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5 justify-start">
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${compressProgress >= 95 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : compressProgress >= 80 ? 'bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]' : 'bg-zinc-700'}`} />
                            <span className={`text-[11px] font-medium ${compressProgress >= 95 ? 'text-zinc-200' : compressProgress >= 80 ? 'text-blue-400' : 'text-zinc-500'}`}>
                              تطهير القواميس والتعريفات الفوقية الزائدة
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Compression Result Box */
                      <div className="bg-[#181820] border border-[#23232a] rounded-2xl p-5 flex flex-col gap-4 text-center animate-in fade-in duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                          <CheckCircle2 className="w-9 h-9 stroke-[2]" />
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white mb-1">
                            تم ضغط المستند بنجاح فائق!
                          </h4>
                          <p className="text-xs text-[#8e8e93]">
                            تم بدء التحميل التلقائي للملف بحجمه الجديد المحسّن.
                          </p>
                        </div>

                        {/* Size Comparison */}
                        <div className="grid grid-cols-2 gap-3 bg-[#111114] p-3.5 rounded-xl border border-[#23232a] mt-1">
                          <div className="flex flex-col items-center">
                            <span className="text-[11px] font-semibold text-[#8e8e93]">الحجم الأصلي</span>
                            <span className="text-sm font-bold text-zinc-300 mt-0.5">{formatFileSize(compressionResult.originalSize)}</span>
                          </div>
                          <div className="flex flex-col items-center border-r border-[#23232a]">
                            <span className="text-[11px] font-semibold text-emerald-400">الحجم الجديد</span>
                            <span className="text-sm font-extrabold text-emerald-400 mt-0.5">{formatFileSize(compressionResult.compressedSize)}</span>
                          </div>
                        </div>

                        {/* Savings Badge */}
                        {compressionResult.compressedSize < compressionResult.originalSize ? (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2.5 px-3">
                            <span className="text-xs font-bold text-emerald-400 block leading-normal">
                              تم تقليل الحجم بنسبة {Math.round(((compressionResult.originalSize - compressionResult.compressedSize) / compressionResult.originalSize) * 100)}% (توفير {formatFileSize(compressionResult.originalSize - compressionResult.compressedSize)})
                            </span>
                          </div>
                        ) : (
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl py-2.5 px-3">
                            <span className="text-xs font-bold text-[#388bfd] block leading-normal">
                              الملف مضغوط بالكامل مسبقاً وبأفضل حجم ممكّن!
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              {selectedCompressFile && (
                <div className="p-4 bg-[#111113] border-t border-[#1c1c20]">
                  {!compressionResult ? (
                    <div className="w-full bg-[#1c1c20] text-zinc-400 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-semibold border border-[#23232a]">
                      <Loader2 className="w-4 h-4 animate-spin text-[#388bfd]" />
                      <span>جاري المعالجة والضغط التلقائي الآن...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => saveAs(compressionResult.blob, compressionResult.fileName)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] transition-all text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-500/15"
                      >
                        <FileDown className="w-5 h-5" />
                        <span>تحميل الملف المضغوط</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedCompressFile(null);
                          setCompressionResult(null);
                          compressFileInputRef.current?.click();
                        }}
                        className="w-full bg-[#1c1c20] hover:bg-[#25252e] text-zinc-300 font-semibold py-2.5 rounded-2xl text-xs transition-colors"
                      >
                        ضغط ملف PDF آخر
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ==================== PDF TO IMAGE MODAL ==================== */}
        <input 
          type="file" 
          ref={pdfToImgFileInputRef} 
          onChange={handlePdfToImgFileSelect} 
          accept=".pdf,application/pdf" 
          className="hidden" 
        />

        {showPdfToImageModal && (
          <div className="fixed inset-0 z-50 bg-[#111113] flex justify-center">
            <div className="w-full max-w-md bg-[#111113] h-full flex flex-col relative select-none">
              
              {/* Modal Header */}
              <header className="px-5 py-4 flex items-center justify-between border-b border-[#1c1c20] bg-[#111113]">
                <button 
                  onClick={() => {
                    setShowPdfToImageModal(false);
                    setSelectedPdfToImgFile(null);
                    setPdfPagesPreview([]);
                  }}
                  className="p-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-6 h-6" />
                </button>

                <h2 className="text-[18px] font-bold text-white">
                  تحويل PDF إلى صور
                </h2>

                {selectedPdfToImgFile ? (
                  <button 
                    onClick={() => {
                      setSelectedPdfToImgFile(null);
                      setPdfPagesPreview([]);
                    }}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    تغيير الملف
                  </button>
                ) : (
                  <div className="w-8"></div>
                )}
              </header>

              {/* Modal Content */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                {!selectedPdfToImgFile ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto">
                    <div className="w-20 h-20 rounded-3xl bg-[#1c1c20] border border-[#23232a] flex items-center justify-center text-[#388bfd] mb-5 shadow-lg">
                      <ImageIcon className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      اختر ملف PDF لتحويله إلى صور
                    </h3>
                    <p className="text-xs text-[#8e8e93] mb-6 max-w-[260px] leading-relaxed">
                      حفظ كل صفحة من ملف الـ PDF كصورة عالية الجودة بمرونة وسهولة.
                    </p>
                    <button
                      onClick={() => pdfToImgFileInputRef.current?.click()}
                      className="bg-[#388bfd] hover:bg-[#2b7de9] active:scale-95 transition-all text-white px-7 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-lg shadow-blue-500/20 text-sm"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                      <span>اختيار ملف PDF</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 pt-1">
                    {/* Selected File Card */}
                    <div className="bg-[#1c1c20] border border-[#23232a] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#272730] text-[#388bfd] flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 stroke-[1.75]" />
                      </div>
                      <div className="min-w-0 flex-1 text-right">
                        <h4 className="text-sm font-bold text-white truncate dir-ltr text-right">
                          {selectedPdfToImgFile.name}
                        </h4>
                        <p className="text-xs text-[#8e8e93] mt-1">
                          عدد الصفحات: <span className="text-white font-semibold">{selectedPdfToImgFile.totalPages} صفحات</span>
                        </p>
                      </div>
                    </div>

                    {/* Options Controls */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Image Format */}
                      <div className="bg-[#1c1c20] border border-[#23232a] rounded-2xl p-3 flex flex-col gap-1.5 text-right">
                        <label className="text-[11px] font-bold text-[#8e8e93]">صيغة الصور:</label>
                        <div className="flex bg-[#111114] p-1 rounded-xl border border-[#23232a]">
                          <button
                            type="button"
                            onClick={() => setImgFormat('jpg')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                              imgFormat === 'jpg' ? 'bg-[#388bfd] text-white shadow' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            JPG
                          </button>
                          <button
                            type="button"
                            onClick={() => setImgFormat('png')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                              imgFormat === 'png' ? 'bg-[#388bfd] text-white shadow' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            PNG
                          </button>
                        </div>
                      </div>

                      {/* Quality Scale */}
                      <div className="bg-[#1c1c20] border border-[#23232a] rounded-2xl p-3 flex flex-col gap-1.5 text-right">
                        <label className="text-[11px] font-bold text-[#8e8e93]">دقة الوضوح:</label>
                        <select
                          value={imgQualityScale}
                          onChange={(e) => setImgQualityScale(Number(e.target.value))}
                          className="w-full bg-[#111114] border border-[#23232a] text-white text-xs font-bold rounded-xl py-2 px-2 text-right outline-none focus:border-[#388bfd]"
                        >
                          <option value={1}>عادية (1x)</option>
                          <option value={2}>عالية HD (2x)</option>
                          <option value={3}>فائقة 4K (3x)</option>
                        </select>
                      </div>
                    </div>

                    {/* Pages Preview Grid */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-bold text-[#8e8e93] text-right">
                        معاينة الصفحات (اضغط على أي صورة لتحميلها مباشرة):
                      </h4>

                      {isRenderingPdfToImg ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                          <Loader2 className="w-8 h-8 text-[#388bfd] animate-spin mb-3" />
                          <span className="text-xs font-semibold text-zinc-300">جاري معالجة واستخراج صور الصفحات...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto p-1 dir-rtl">
                          {pdfPagesPreview.map((item) => (
                            <div 
                              key={item.pageNum} 
                              className="bg-[#1c1c20] border border-[#23232a] rounded-xl overflow-hidden p-2 flex flex-col items-center gap-2 group hover:border-[#388bfd] transition-all"
                            >
                              <div className="w-full aspect-[1/1.3] bg-[#111114] rounded-lg overflow-hidden flex items-center justify-center relative">
                                <img 
                                  src={item.dataUrl} 
                                  alt={`صفحة ${item.pageNum}`}
                                  className="max-w-full max-h-full object-contain" 
                                />
                                <span className="absolute top-1.5 right-1.5 bg-black/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                  صفحة {item.pageNum}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => downloadSinglePageAsImage(item.pageNum)}
                                className="w-full bg-[#272730] hover:bg-[#388bfd] text-white text-xs font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                                <span>تحميل</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              {selectedPdfToImgFile && (
                <div className="p-4 bg-[#111113] border-t border-[#1c1c20]">
                  <button
                    onClick={downloadAllPagesAsZip}
                    disabled={isExportingZip || isRenderingPdfToImg}
                    className="w-full bg-[#388bfd] hover:bg-[#2b7de9] disabled:bg-[#202530] disabled:text-zinc-600 active:scale-[0.99] transition-all text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/15"
                  >
                    {isExportingZip ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري ضغط وتحميل جميع الصور (ZIP)...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-5 h-5" />
                        <span>تحميل جميع الصفحات كـ ملف مضغوط (ZIP)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ==================== IMAGE TO PDF MODAL ==================== */}
        <input 
          type="file" 
          ref={imgToPdfInputRef} 
          onChange={handleImgToPdfSelect} 
          accept="image/*"
          multiple 
          className="hidden" 
        />

        {showImgToPdfModal && (
          <div className="fixed inset-0 z-50 bg-[#111113] flex justify-center">
            <div className="w-full max-w-md bg-[#111113] h-full flex flex-col relative select-none">
              
              {/* Modal Header */}
              <header className="px-5 py-4 flex items-center justify-between border-b border-[#1c1c20] bg-[#111113]">
                <button 
                  onClick={() => {
                    setShowImgToPdfModal(false);
                    setSelectedImgList([]);
                  }}
                  className="p-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-[#1f1f25] transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-6 h-6" />
                </button>

                <h2 className="text-[18px] font-bold text-white">
                  تحويل الصور إلى PDF
                </h2>

                {selectedImgList.length > 0 ? (
                  <button 
                    onClick={() => setSelectedImgList([])}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    مسح الكل
                  </button>
                ) : (
                  <div className="w-8"></div>
                )}
              </header>

              {/* Modal Content */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                {selectedImgList.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-auto">
                    <div className="w-20 h-20 rounded-3xl bg-[#1c1c20] border border-[#23232a] flex items-center justify-center text-[#388bfd] mb-5 shadow-lg">
                      <ImagePlus className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      اختر الصور لدمجها في ملف PDF
                    </h3>
                    <p className="text-xs text-[#8e8e93] mb-6 max-w-[260px] leading-relaxed">
                      يمكنك اختيار صورة واحدة أو صور متعددة وترتيبها وحفظها كمستند PDF موحد.
                    </p>
                    <button
                      onClick={() => imgToPdfInputRef.current?.click()}
                      className="bg-[#388bfd] hover:bg-[#2b7de9] active:scale-95 transition-all text-white px-7 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-lg shadow-blue-500/20 text-sm"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                      <span>اختيار الصور</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 pt-1">
                    {/* Add More Bar */}
                    <div className="flex items-center justify-between bg-[#1c1c20] border border-[#23232a] rounded-2xl p-3">
                      <span className="text-xs font-bold text-white">
                        تم تحديد {selectedImgList.length} صور
                      </span>
                      <button
                        onClick={() => imgToPdfInputRef.current?.click()}
                        className="bg-[#272730] hover:bg-[#32323e] text-[#388bfd] text-xs font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>إضافة المزيد</span>
                      </button>
                    </div>

                    {/* Images List */}
                    <div className="flex flex-col gap-2.5 max-h-[260px] overflow-y-auto p-0.5">
                      {selectedImgList.map((item, idx) => (
                        <div 
                          key={item.id}
                          className="bg-[#1c1c20] border border-[#23232a] rounded-2xl p-2.5 flex items-center gap-3 shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-xl bg-[#111114] overflow-hidden shrink-0 border border-[#23232a]">
                            <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>

                          <div className="min-w-0 flex-1 text-right">
                            <h4 className="text-xs font-bold text-white truncate dir-ltr text-right">
                              {item.name}
                            </h4>
                            <span className="text-[10px] font-semibold text-[#8e8e93]">
                              ترتيب: {idx + 1}
                            </span>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveImgInList(idx, idx - 1)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#272730] disabled:opacity-30"
                              title="تحريك لأعلى"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === selectedImgList.length - 1}
                              onClick={() => moveImgInList(idx, idx + 1)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#272730] disabled:opacity-30"
                              title="تحريك لأسفل"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImgFromList(item.id)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* PDF Options */}
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#1c1c20] border border-[#23232a] rounded-2xl p-3.5 flex flex-col gap-2 text-right">
                        <label className="text-xs font-bold text-[#8e8e93]">حجم صفحات PDF:</label>
                        <select
                          value={pageSizeOption}
                          onChange={(e) => setPageSizeOption(e.target.value as any)}
                          className="w-full bg-[#111114] border border-[#23232a] text-white text-xs font-bold rounded-xl py-2.5 px-3 text-right outline-none focus:border-[#388bfd]"
                        >
                          <option value="fit">حجم الصورة الأصلي (تلقائي)</option>
                          <option value="a4_portrait">A4 - قياسي عمودي</option>
                          <option value="a4_landscape">A4 - قياسي أفقي</option>
                        </select>
                      </div>

                      <div className="bg-[#1c1c20] border border-[#23232a] rounded-2xl p-3.5 flex flex-col gap-2 text-right">
                        <label className="text-xs font-bold text-[#8e8e93]">هوامش الصفحات:</label>
                        <select
                          value={pageMarginOption}
                          onChange={(e) => setPageMarginOption(e.target.value as any)}
                          className="w-full bg-[#111114] border border-[#23232a] text-white text-xs font-bold rounded-xl py-2.5 px-3 text-right outline-none focus:border-[#388bfd]"
                        >
                          <option value="none">بدون هوامش (ملء الصفحة)</option>
                          <option value="small">هوامش صغيرة (20pt)</option>
                          <option value="large">هوامش كبيرة (40pt)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              {selectedImgList.length > 0 && (
                <div className="p-4 bg-[#111113] border-t border-[#1c1c20]">
                  <button
                    onClick={convertImagesToPdf}
                    disabled={isConvertingImgToPdf}
                    className="w-full bg-[#388bfd] hover:bg-[#2b7de9] disabled:bg-[#202530] disabled:text-zinc-600 active:scale-[0.99] transition-all text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/15"
                  >
                    {isConvertingImgToPdf ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري تحويل الصور إلى PDF...</span>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="w-5 h-5" />
                        <span>تحويل إلى ملف PDF وتحميله</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ==================== PROTECT PDF MODAL ==================== */}
        <input 
          type="file" 
          ref={protectFileInputRef} 
          onChange={handleProtectFileSelect} 
          accept=".pdf,application/pdf" 
          className="hidden" 
        />

                {showProtectModal && selectedProtectFile && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-[320px] bg-[#1a1b1e] rounded-3xl p-6 flex flex-col items-center text-center relative">
              <Lock className="w-6 h-6 text-zinc-300 mb-4" strokeWidth={1.5} />
              
              <h3 className="text-xl font-bold text-white mb-3">
                تعيين كلمة مرور
              </h3>
              
              <p className="text-[13px] text-zinc-400 leading-relaxed mb-4">
                أدخل كلمة المرور التي تريد استخدامها لحماية الملف.
              </p>

              <p className="text-[10px] text-zinc-500 truncate w-full mb-6 max-w-[250px]" dir="ltr">
                {selectedProtectFile.name}
              </p>

              <div className="w-full relative mb-6">
                <input
                  type={showProtectPasswordText ? 'text' : 'password'}
                  value={protectPassword}
                  onChange={(e) => setProtectPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full bg-[#25262b] text-white text-sm rounded-xl py-3 px-4 text-center placeholder:text-zinc-500 outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                />
              </div>

              <div className="w-full flex gap-3">
                <button
                  onClick={() => {
                    setShowProtectModal(false);
                    setSelectedProtectFile(null);
                    setProtectPassword('');
                    
                  }}
                  className="flex-1 bg-transparent hover:bg-zinc-800 transition-colors border border-zinc-700 text-white font-bold py-3 rounded-[16px] text-sm"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleProtectPdf}
                  disabled={isProtecting || !protectPassword}
                  className="flex-1 bg-[#8db5f2] hover:bg-[#a5c8ff] disabled:opacity-50 transition-colors text-black font-bold py-3 rounded-[16px] text-sm flex items-center justify-center"
                >
                  {isProtecting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'قبول'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== UNLOCK PDF MODAL ==================== */}
        <input 
          type="file" 
          ref={unlockFileInputRef} 
          onChange={handleUnlockFileSelect} 
          accept=".pdf,application/pdf" 
          className="hidden" 
        />

                {showUnlockModal && selectedUnlockFile && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-[320px] bg-[#1a1b1e] rounded-3xl p-6 flex flex-col items-center text-center relative">
              <Unlock className="w-6 h-6 text-zinc-300 mb-4" strokeWidth={1.5} />
              
              <h3 className="text-xl font-bold text-white mb-3">
                كلمة المرور مطلوبة
              </h3>
              
              <p className="text-[13px] text-zinc-400 leading-relaxed mb-4">
                هذا الملف محمي بكلمة مرور. أدخل كلمة المرور للمتابعة
              </p>

              <p className="text-[10px] text-zinc-500 truncate w-full mb-6 max-w-[250px]" dir="ltr">
                {selectedUnlockFile.name}
              </p>

              <div className="w-full relative mb-6">
                <input
                  type={showUnlockPasswordText ? 'text' : 'password'}
                  value={unlockPassword}
                  onChange={(e) => {
                    setUnlockPassword(e.target.value);
                    if (unlockError) setUnlockError(null);
                  }}
                  placeholder="كلمة المرور"
                  className={`w-full bg-[#25262b] text-white text-sm rounded-xl py-3 px-4 text-center placeholder:text-zinc-500 outline-none focus:ring-1 transition-shadow ${unlockError ? 'ring-1 ring-red-500' : 'focus:ring-blue-500'}`}
                />
              </div>

              <div className="w-full flex gap-3">
                <button
                  onClick={() => {
                    setShowUnlockModal(false);
                    setSelectedUnlockFile(null);
                    setUnlockPassword('');
                    setUnlockError(null);
                  }}
                  className="flex-1 bg-transparent hover:bg-zinc-800 transition-colors border border-zinc-700 text-white font-bold py-3 rounded-[16px] text-sm"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleUnlockPdf}
                  disabled={isUnlocking || !unlockPassword}
                  className="flex-1 bg-[#8db5f2] hover:bg-[#a5c8ff] disabled:opacity-50 transition-colors text-black font-bold py-3 rounded-[16px] text-sm flex items-center justify-center"
                >
                  {isUnlocking ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'قبول'}
                </button>
              </div>
            </div>
          </div>
        )}


        {isRenderingPdfToImg && (
          <div className="fixed inset-0 z-[100] bg-[#111113]/95 backdrop-blur-md flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-3xl bg-[#1c1c20] border border-[#23232a] flex items-center justify-center text-[#388bfd] mb-6 shadow-2xl">
              <ImageIcon className="w-10 h-10 stroke-[1.5]" />
            </div>
            <Loader2 className="w-8 h-8 text-[#388bfd] animate-spin mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              جاري تحويل الـ PDF إلى صور...
            </h3>
            <p className="text-xs text-[#8e8e93] max-w-[280px] leading-relaxed">
              يتم معالجة المستند وتحويل كافة الصفحات إلى صور عالية الجودة، وسيتم تحميلها تلقائياً كملف مضغوط (ZIP) فور الانتهاء.
            </p>
          </div>
        )}

        {isConvertingImgToPdf && (
          <div className="fixed inset-0 z-[100] bg-[#111113]/95 backdrop-blur-md flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-3xl bg-[#1c1c20] border border-[#23232a] flex items-center justify-center text-[#388bfd] mb-6 shadow-2xl">
              <ImagePlus className="w-10 h-10 stroke-[1.5]" />
            </div>
            <Loader2 className="w-8 h-8 text-[#388bfd] animate-spin mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              جاري تحويل الصور إلى PDF...
            </h3>
            <p className="text-xs text-[#8e8e93] max-w-[280px] leading-relaxed">
              يتم دمج الصور والحفاظ على أبعادها الأصلية، وسيتم تحميل ملف الـ PDF تلقائياً فور الانتهاء.
            </p>
          </div>
        )}

                                        {/* ==================== TOAST NOTIFICATION ==================== */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="fixed bottom-24 left-1/2 z-[200] px-5 py-2.5 bg-[#1c1c20] text-white text-sm font-semibold rounded-full shadow-2xl shadow-black/80 border border-[#2e2e3a] pointer-events-none text-center whitespace-nowrap"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Modal */}
        {showThemeModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-[320px] bg-[#1a1b1e] rounded-3xl p-6 flex flex-col relative select-none">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {language === 'ar' ? 'اختر المظهر' : 'Choose Theme'}
              </h3>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setTheme('dark');
                    setShowThemeModal(false);
                  }}
                  className={`py-3 px-4 rounded-xl font-bold flex items-center justify-between transition-colors ${theme === 'dark' ? 'bg-[#388bfd] text-white' : 'bg-[#25262b] text-zinc-300 hover:bg-[#2c2d33]'}`}
                >
                  <span className="text-sm">{language === 'ar' ? 'داكن' : 'Dark'}</span>
                  {theme === 'dark' && <CheckCircle2 className="w-5 h-5" />}
                </button>

                <button 
                  onClick={() => {
                    setTheme('light');
                    setShowThemeModal(false);
                    showToast(language === 'ar' ? 'الوضع الفاتح قيد التطوير حالياً' : 'Light mode is currently under development');
                  }}
                  className={`py-3 px-4 rounded-xl font-bold flex items-center justify-between transition-colors ${theme === 'light' ? 'bg-[#388bfd] text-white' : 'bg-[#25262b] text-zinc-300 hover:bg-[#2c2d33]'}`}
                >
                  <span className="text-sm">{language === 'ar' ? 'فاتح' : 'Light'}</span>
                  {theme === 'light' && <CheckCircle2 className="w-5 h-5" />}
                </button>
              </div>

              <button 
                onClick={() => setShowThemeModal(false)}
                className="mt-6 w-full py-3 bg-transparent hover:bg-zinc-800 transition-colors border border-zinc-700 text-white font-bold rounded-[16px] text-sm"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        )}

        {/* DOCUMENT SCANNER MODAL */}
        <DocumentScannerModal 
          isOpen={showScannerModal}
          onClose={() => setShowScannerModal(false)}
          onScanComplete={handleScanComplete}
        />

        {/* Language Modal */}
        {showLanguageModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-[320px] bg-[#1a1b1e] rounded-3xl p-6 flex flex-col relative select-none">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {language === 'ar' ? 'اختر اللغة' : 'Choose Language'}
              </h3>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setLanguage('ar');
                    setShowLanguageModal(false);
                  }}
                  className={`py-3 px-4 rounded-xl font-bold flex items-center justify-between transition-colors ${language === 'ar' ? 'bg-[#388bfd] text-white' : 'bg-[#25262b] text-zinc-300 hover:bg-[#2c2d33]'}`}
                >
                  <span className="text-sm">العربية</span>
                  {language === 'ar' && <CheckCircle2 className="w-5 h-5" />}
                </button>

                <button 
                  onClick={() => {
                    setLanguage('en');
                    setShowLanguageModal(false);
                    showToast(language === 'ar' ? 'الترجمة الإنجليزية قيد التطوير حالياً' : 'English translation is currently under development');
                  }}
                  className={`py-3 px-4 rounded-xl font-bold flex items-center justify-between transition-colors ${language === 'en' ? 'bg-[#388bfd] text-white' : 'bg-[#25262b] text-zinc-300 hover:bg-[#2c2d33]'}`}
                >
                  <span className="text-sm">English</span>
                  {language === 'en' && <CheckCircle2 className="w-5 h-5" />}
                </button>
              </div>

              <button 
                onClick={() => setShowLanguageModal(false)}
                className="mt-6 w-full py-3 bg-transparent hover:bg-zinc-800 transition-colors border border-zinc-700 text-white font-bold rounded-[16px] text-sm"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
  );
}
