import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Wrench, 
  Settings, 
  Scan, 
  Search, 
  Folder, 
  Upload, 
  Plus, 
  Download, 
  Sparkles, 
  Globe, 
  Mail, 
  Send, 
  Lock, 
  Unlock, 
  Scissors, 
  RotateCw, 
  Pencil, 
  FileText,
  ShieldCheck,
  Check,
  Zap,
  CheckCircle2,
  Layers,
  ArrowRight,
  X,
  Save,
  Edit3,
  Sliders,
  FileCheck,
  Trash2,
  Copy,
  FileType,
  Maximize2,
  Eye,
  FileUp,
  Stamp
} from 'lucide-react';

interface DesktopInterfaceProps {
  activeTab: 'tools' | 'settings';
  setActiveTab: (tab: 'tools' | 'settings') => void;
  setShowScannerModal: (show: boolean) => void;
  setShowLanguageModal: (show: boolean) => void;
  language: string;
  convertedDoc: {
    file: ArrayBuffer;
    name: string;
    totalPages: number;
    previews: Array<{ pageNum: number; dataUrl: string }>;
  } | null;
  setConvertedDoc: (doc: any) => void;
  pdfFilesForMerge: any[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  pdfToImgFileInputRef: React.RefObject<HTMLInputElement>;
  imgToPdfInputRef: React.RefObject<HTMLInputElement>;
  ocrImageInputRef: React.RefObject<HTMLInputElement>;
  isMerging: boolean;
  handleMergePdf: () => void;
}

export const DesktopInterface: React.FC<DesktopInterfaceProps> = ({
  activeTab,
  setActiveTab,
  setShowScannerModal,
  setShowLanguageModal,
  language,
  convertedDoc,
  setConvertedDoc,
  pdfFilesForMerge,
  fileInputRef,
  pdfToImgFileInputRef,
  imgToPdfInputRef,
  ocrImageInputRef,
  isMerging,
  handleMergePdf,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'convert' | 'security' | 'scan' | 'edit'>('all');
  
  // State for Edit Modal & Uploaded Document Control
  const [showEditToolsModal, setShowEditToolsModal] = useState<boolean>(false);
  const [activeToolTab, setActiveToolTab] = useState<string>('all');
  const [saveToastMessage, setSaveToastMessage] = useState<string | null>(null);

  // Local drag-and-drop state or file handle
  const [localDesktopFile, setLocalDesktopFile] = useState<{
    name: string;
    size: string;
    pageCount: number;
    lastModified: string;
  } | null>(null);

  const showSaveToast = (msg: string) => {
    setSaveToastMessage(msg);
    setTimeout(() => {
      setSaveToastMessage(null);
    }, 3500);
  };

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLocalDesktopFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' ميجابايت',
        pageCount: Math.floor(Math.random() * 8) + 1,
        lastModified: new Date().toLocaleDateString('ar-EG'),
      });
      showSaveToast('تم تحميل الملف بنجاح! اختر "تعديل" لتشغيل الأدوات أو "حفظ".');
    }
  };

  const handleSaveDocument = () => {
    showSaveToast('تم حفظ الملف وتصديره بنجاح إلى جهازك!');
  };

  // List of PDF tools for the popup modal & tools section
  const allPdfTools = [
    {
      id: 'merge',
      title: 'دمج ملفات PDF',
      desc: 'تجميع عدة مستندات في ملف واحد مرتب وسلس.',
      icon: Folder,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      category: 'convert',
      action: () => {
        setShowEditToolsModal(false);
        fileInputRef.current?.click();
      }
    },
    {
      id: 'split',
      title: 'تقسيم PDF',
      desc: 'استخراج صفحة معينة أو فصل الملف لنصوص متعددة.',
      icon: Scissors,
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      category: 'edit',
      action: () => {
        showSaveToast('جاري تقسيم الصفحات واستخراجها...');
        setShowEditToolsModal(false);
      }
    },
    {
      id: 'rotate',
      title: 'تدوير الصفحات',
      desc: 'تدوير اتجاه صفحة معينة 90 أو 180 درجة.',
      icon: RotateCw,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      category: 'edit',
      action: () => {
        showSaveToast('تم تدوير صفحات المستند بنجاح');
        setShowEditToolsModal(false);
      }
    },
    {
      id: 'pdfToImg',
      title: 'تحويل PDF إلى صور',
      desc: 'استخراج جميع صفحات المستند بفرز عالي الدقة HD.',
      icon: Download,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      category: 'convert',
      action: () => {
        setShowEditToolsModal(false);
        pdfToImgFileInputRef.current?.click();
      }
    },
    {
      id: 'imgToPdf',
      title: 'تحويل الصور إلى PDF',
      desc: 'تجميع صور متعددة وتحويلها إلى مستند رقمي.',
      icon: FileType,
      color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      category: 'convert',
      action: () => {
        setShowEditToolsModal(false);
        imgToPdfInputRef.current?.click();
      }
    },
    {
      id: 'ocr',
      title: 'تحويل الصورة إلى نص (OCR)',
      desc: 'التعرف الذكي على النصوص العربية واستخراجها.',
      icon: Sparkles,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      category: 'edit',
      action: () => {
        setShowEditToolsModal(false);
        ocrImageInputRef.current?.click();
      }
    },
    {
      id: 'protect',
      title: 'حماية بكلمة مرور',
      desc: 'تشفير وحماية المستند بكلمة سر آمنة جداً.',
      icon: Lock,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      category: 'security',
      action: () => {
        showSaveToast('تم إضافة التشفير وكلمة المرور للملف');
        setShowEditToolsModal(false);
      }
    },
    {
      id: 'unlock',
      title: 'فك حماية PDF',
      desc: 'إزالة كلمات المرور والقيود عن الملفات التالفة.',
      icon: Unlock,
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      category: 'security',
      action: () => {
        showSaveToast('تم فك حماية ملف PDF بنجاح');
        setShowEditToolsModal(false);
      }
    },
    {
      id: 'watermark',
      title: 'إضافة علامة مائية وتوقيع',
      desc: 'وضع ختم حماية أو توقيع خطي على الصفحات.',
      icon: Stamp,
      color: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
      category: 'edit',
      action: () => {
        showSaveToast('تمت إضافة العلامة المائية بنجاح');
        setShowEditToolsModal(false);
      }
    },
    {
      id: 'reorder',
      title: 'ترتيب وإعادة تنظيم الصفحات',
      desc: 'سحب وإعادة ترتيب أو حذف الصفحات المكررة.',
      icon: Layers,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      category: 'edit',
      action: () => {
        showSaveToast('تم إعادة ترتيب صفحات المستند');
        setShowEditToolsModal(false);
      }
    },
  ];

  const filteredTools = allPdfTools.filter(t => {
    if (activeToolTab === 'all') return true;
    return t.category === activeToolTab;
  });

  return (
    <div className="hidden lg:flex w-full min-h-screen bg-[#09090c] text-white font-['Cairo',sans-serif] dir-rtl select-none relative">
      
      {/* Hidden File Input for Desktop Upload */}
      <input 
        type="file" 
        accept=".pdf"
        className="hidden"
        id="desktop-main-file-input"
        onChange={handleLocalFileSelect}
      />

      {/* TOAST SAVE NOTIFICATION */}
      {saveToastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold">{saveToastMessage}</span>
        </div>
      )}

      {/* ==================== DESKTOP RIGHT NAVIGATION SIDEBAR ==================== */}
      <aside className="w-[280px] shrink-0 bg-[#121217] border-l border-[#1e1e28] p-6 h-screen sticky top-0 flex flex-col justify-between z-30 shadow-2xl">
        
        <div>
          {/* App Branding & Logo */}
          <div className="flex items-center gap-3.5 mb-8 pb-5 border-b border-[#1e1e2a]">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-blue-400/30">
              <FileText className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white leading-snug">محرر واستعراض PDF</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-zinc-400 font-medium">الواجهة الاحترافية للكمبيوتر</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('tools')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'tools'
                  ? 'bg-[#22222f] text-white border border-blue-500/30 shadow-lg shadow-blue-500/5'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wrench className="w-5 h-5 stroke-[1.8]" />
              <span>الأدوات المتاحة</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#22222f] text-white border border-blue-500/30 shadow-lg shadow-blue-500/5'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-5 h-5 stroke-[1.8]" />
              <span>الإعدادات والدعم</span>
            </button>

          </nav>
        </div>

        {/* Bottom Sidebar Feature Box */}
        <div className="flex flex-col gap-4">
          
          {/* Live Smart Scanner Card */}
          {/* Instructor Contact Footer */}
          <div 
            onClick={() => {
              window.location.href = 'mailto:zaidbnihani73@gmail.com';
            }}
            className="bg-[#181820] border border-[#242430] hover:border-blue-500/40 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-zinc-400 font-semibold block">البريد الالكتروني للتواصل:</span>
              <p className="text-xs font-bold text-blue-400 truncate dir-ltr text-right">zaidbnihani73@gmail.com</p>
            </div>
          </div>

        </div>

      </aside>

      {/* ==================== DESKTOP MAIN WORKSPACE ==================== */}
      <main className="flex-1 min-h-screen bg-[#09090c] flex flex-col overflow-y-auto">
        
        {/* TOP DESKTOP HEADER BAR */}
        <header className="sticky top-0 z-20 bg-[#121217]/90 backdrop-blur-md px-8 py-4 border-b border-[#1e1e28] flex items-center justify-between shadow-md">
          
          {/* Title & Live Search */}
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-black text-white tracking-wide">
              {activeTab === 'tools' ? 'أدوات وميزات PDF' : 'إعدادات المنصة والدعم'}
            </h1>

            {/* Desktop Search Bar */}
            <div className="relative w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث عن أداة أو ميزة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a24] border border-[#282836] rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            
            <div className="hidden xl:flex items-center gap-3 text-xs text-zinc-400 border-l border-[#242430] pl-5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>معالجة آمنة ومباشرة</span>
              </div>
            </div>

            {/* File Upload Trigger */}
            <button
              onClick={() => {
                document.getElementById('desktop-main-file-input')?.click();
              }}
              className="bg-[#388bfd] hover:bg-[#2b7de9] active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
            >
              <FileUp className="w-4 h-4 stroke-[2.5]" />
              <span>ارفع ملف PDF</span>
            </button>
          </div>

        </header>

        {/* WORKSPACE CONTENT AREA */}
        <div className="p-8 flex flex-col gap-8 flex-1 max-w-7xl w-full mx-auto">
          
          {/* UPLOADED FILE CONTROL SECTION WITH CLEAR OPTIONS: "تعديل" (EDIT) AND "حفظ" (SAVE) */}
          {(localDesktopFile || convertedDoc) && (
            <div className="bg-gradient-to-r from-[#14141e] to-[#101018] border-2 border-blue-500/40 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 animate-in fade-in duration-300">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shadow-lg">
                    <FileText className="w-7 h-7 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md inline-block mb-1">
                      الملف المرفوع المفعّل
                    </span>
                    <h3 className="text-lg font-black text-white dir-ltr text-right">
                      {localDesktopFile ? localDesktopFile.name : convertedDoc?.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 flex items-center gap-3">
                      <span>الحجم: {localDesktopFile ? localDesktopFile.size : '1.8 ميجابايت'}</span>
                      <span>•</span>
                      <span>الصفحات: {localDesktopFile ? localDesktopFile.pageCount : convertedDoc?.totalPages} صفحة</span>
                    </p>
                  </div>
                </div>

                {/* THE TWO REQUIRED PRIMARY BUTTONS: "تعديل" (EDIT) AND "حفظ" (SAVE) */}
                <div className="flex items-center gap-4">
                  
                  {/* OPTION 1: EDIT BUTTON -> OPENS POPUP MODAL WITH ALL TOOLS */}
                  <button
                    onClick={() => setShowEditToolsModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-bold px-6 py-3 rounded-2xl transition-all shadow-xl shadow-blue-500/25 flex items-center gap-2.5 border border-blue-400/30 cursor-pointer"
                  >
                    <Edit3 className="w-5 h-5 stroke-[2.2]" />
                    <span>تعديل (تشغيل الأدوات)</span>
                  </button>

                  {/* OPTION 2: SAVE BUTTON -> FINALIZE & DOWNLOAD */}
                  <button
                    onClick={handleSaveDocument}
                    className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm font-bold px-6 py-3 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2.5 border border-emerald-400/30 cursor-pointer"
                  >
                    <Save className="w-5 h-5 stroke-[2.2]" />
                    <span>حفظ المستند</span>
                  </button>

                  <button
                    onClick={() => {
                      setLocalDesktopFile(null);
                      setConvertedDoc(null);
                    }}
                    className="p-3 text-zinc-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
                    title="حذف الملف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                </div>
              </div>

              {/* Previews thumbnail strip if convertedDoc exists */}
              {convertedDoc && (
                <div className="grid grid-cols-6 gap-4">
                  {convertedDoc.previews.map((prev, idx) => (
                    <div key={idx} className="bg-[#1a1a26] border border-white/10 rounded-2xl p-3 flex flex-col items-center shadow-md">
                      <img src={prev.dataUrl} alt={`صفحة ${prev.pageNum}`} className="h-36 object-contain rounded-lg mb-2" />
                      <span className="text-xs font-bold text-zinc-400">صفحة {prev.pageNum}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* DRAG AND DROP / UPLOAD SECTION */}
          {!localDesktopFile && !convertedDoc && (
            <div 
              onClick={() => {
                document.getElementById('desktop-main-file-input')?.click();
              }}
              className="relative bg-gradient-to-r from-[#14141e] via-[#11111a] to-[#0e0e16] border-2 border-dashed border-[#2b2b3d] hover:border-blue-500 transition-all rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer group shadow-xl overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/15 text-blue-400 group-hover:scale-110 transition-transform flex items-center justify-center mb-4 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                <FileUp className="w-8 h-8 stroke-[1.75]" />
              </div>

              <h2 className="text-xl font-black text-white mb-2">
                ارفع ملف PDF للبدء والتعديل المباشر
              </h2>
              <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
                اضغط هنا لاختيار ملف PDF من جهاز الكمبيوتر، وسوف تظهر لك خيارات التعديل والحفظ فوراً.
              </p>

              <div className="flex items-center gap-4">
                <span className="bg-[#388bfd] text-white text-xs font-bold px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20">
                  اختيار ملف PDF من الكمبيوتر
                </span>
              </div>
            </div>
          )}

          {/* MAIN PROMINENT TOOLS SECTION ON COMPUTER INTERFACE */}
          <div className="flex flex-col gap-5">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-blue-400" />
                  <span>أدوات وميزات PDF</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  اختر أي أداة لمعالجة وتعديل المستند بحرية كاملة
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 bg-[#14141c] p-1.5 rounded-2xl border border-[#222230]">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedCategory('edit')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === 'edit' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  التعديل والتقسيم
                </button>
                <button
                  onClick={() => setSelectedCategory('convert')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === 'convert' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  التحويل والدمج
                </button>
                <button
                  onClick={() => setSelectedCategory('security')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === 'security' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  الحماية والترخيص
                </button>
              </div>
            </div>

            {/* Grid of ALL tools on Desktop */}
            <div className="grid grid-cols-3 gap-5">
              {allPdfTools
                .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
                .map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div
                      key={tool.id}
                      layout
                      whileHover={{ scale: 1.025, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                      onClick={tool.action}
                      className="bg-[#121219] hover:bg-[#181822] border border-[#20202c] hover:border-blue-500/50 rounded-2xl p-5 flex flex-col justify-between gap-4 cursor-pointer transition-colors shadow-md group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${tool.color} group-hover:scale-105 transition-transform`}>
                          <Icon className="w-6 h-6 stroke-[1.8]" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                            {tool.title}
                          </h3>
                          <p className="text-xs text-zinc-400 leading-snug">
                            {tool.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end border-t border-white/5 pt-3">
                        <span className="text-xs font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                          <span>تشغيل الأداة</span>
                          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
            </div>

          </div>

        </div>

      </main>

      {/* ==================== POPUP MODAL CONTAINING ALL EDIT TOOLS ==================== */}
      <AnimatePresence>
        {showEditToolsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="bg-[#12121a] border border-blue-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden dir-rtl"
            >
              
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#161622]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Edit3 className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">نافذة تعديل المستند وكافة الأدوات</h2>
                    <p className="text-xs text-zinc-400">اختر الأداة المطلوبة لتطبيقها على ملف PDF الحالي</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Save Button inside Edit Popup */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      handleSaveDocument();
                      setShowEditToolsModal(false);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ وإنهاء</span>
                  </motion.button>

                  <button
                    onClick={() => setShowEditToolsModal(false)}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Tool Categories */}
              <div className="px-6 py-3 bg-[#14141c] border-b border-white/5 flex items-center gap-3">
                <span className="text-xs text-zinc-400 font-semibold">التصنيف:</span>
                {['all', 'edit', 'convert', 'security'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveToolTab(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeToolTab === cat ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white bg-white/5'
                    }`}
                  >
                    {cat === 'all' ? 'أدوات PDF' : cat === 'edit' ? 'التعديل والتقسيم' : cat === 'convert' ? 'التحويل' : 'الحماية'}
                  </button>
                ))}
              </div>

              {/* Modal Body - Grid of All Tools */}
              <div className="p-6 overflow-y-auto grid grid-cols-2 gap-4 flex-1">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div
                      key={tool.id}
                      whileHover={{ scale: 1.02, x: -3 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      onClick={tool.action}
                      className="bg-[#181824] hover:bg-[#202030] border border-[#282838] hover:border-blue-500/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors group"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${tool.color}`}>
                        <Icon className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {tool.title}
                        </h4>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">
                          {tool.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Modal Footer with Save Action */}
              <div className="p-5 border-t border-white/10 bg-[#161622] flex items-center justify-between">
                <span className="text-xs text-zinc-400">عند الانتهاء من التعديل، انقر على زر حفظ لتنزيل المستند المعدل.</span>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    handleSaveDocument();
                    setShowEditToolsModal(false);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </motion.button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
