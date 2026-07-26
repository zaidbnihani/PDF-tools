import React, { useState } from 'react';
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
  Tablet,
  ExternalLink
} from 'lucide-react';

interface TabletInterfaceProps {
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

export const TabletInterface: React.FC<TabletInterfaceProps> = ({
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

  return (
    <div className="hidden md:flex lg:hidden w-full min-h-screen bg-[#0d0d10] text-white font-['Cairo',sans-serif] dir-rtl select-none">
      
      {/* ==================== RIGHT TABLET SIDEBAR ==================== */}
      <aside className="w-[230px] shrink-0 bg-[#141418] border-l border-[#22222a] p-5 flex flex-col justify-between h-screen sticky top-0 z-20">
        <div>
          {/* Header Branding */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#22222c]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">أدوات PDF</h2>
              <span className="text-[10px] text-blue-400 font-medium bg-blue-500/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                نسخة الجهاز اللوحي
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('tools')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'tools'
                  ? 'bg-[#282834] text-white shadow-md border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>الأدوات والتأثيرات</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#282834] text-white shadow-md border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>الإعدادات</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* ==================== MAIN TABLET WORKSPACE ==================== */}
      <main className="flex-1 min-h-screen bg-[#0d0d10] p-6 flex flex-col gap-6 overflow-y-auto">
        
        {/* Tablet Top Navigation Bar */}
        <header className="flex items-center justify-between bg-[#141418] border border-[#22222a] p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <Tablet className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold text-white">
              {activeTab === 'tools' ? 'مركز الأدوات الذكية' : 'الإعدادات والدعم'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-60">
              <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث في المستندات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1c24] border border-[#282834] rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Quick Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة ملفات</span>
            </button>
          </div>
        </header>

        {/* ACTIVE CONVERTED DOCUMENT DISPLAY IF ANY */}
        {convertedDoc && (
          <div className="bg-[#181820] border border-blue-500/30 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white dir-ltr text-right">{convertedDoc.name}</h3>
                  <span className="text-xs text-zinc-400">إجمالي الصفحات: {convertedDoc.totalPages}</span>
                </div>
              </div>

              <button
                onClick={() => setConvertedDoc(null)}
                className="text-xs font-bold text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition-all"
              >
                إغلاق المستند
              </button>
            </div>

            {/* Previews Horizontal Row */}
            <div className="grid grid-cols-4 gap-4 overflow-x-auto py-2">
              {convertedDoc.previews.map((prev, idx) => (
                <div key={idx} className="relative bg-zinc-900 rounded-xl p-2 border border-white/10 flex flex-col items-center">
                  <img src={prev.dataUrl} alt={`صفحة ${prev.pageNum}`} className="h-36 object-contain rounded mb-2" />
                  <span className="text-[11px] font-bold text-zinc-400">صفحة {prev.pageNum}</span>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* TAB 2: TOOLS */}
        <AnimatePresence mode="wait">
          {activeTab === 'tools' && (
            <motion.div
              key="tablet-tools"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              
              {/* Tool 1 */}
              <motion.div 
                whileHover={{ scale: 1.02, x: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#181820] hover:bg-[#20202c] border border-[#262634] hover:border-blue-500/40 p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                  <Folder className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-bold text-white">دمج ملفات PDF</h4>
                  <p className="text-xs text-zinc-400 mt-1">دمج وتنظيم ملفات متعددة</p>
                </div>
              </motion.div>

              {/* Tool 3 */}
              <motion.div 
                whileHover={{ scale: 1.02, x: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                onClick={() => pdfToImgFileInputRef.current?.click()}
                className="bg-[#181820] hover:bg-[#20202c] border border-[#262634] hover:border-blue-500/40 p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <Download className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-bold text-white">تحويل PDF إلى صور</h4>
                  <p className="text-xs text-zinc-400 mt-1">حفظ كل صفحة كصورة عالية الدقة</p>
                </div>
              </motion.div>

              {/* Tool 4 */}
              <motion.div 
                whileHover={{ scale: 1.02, x: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                onClick={() => ocrImageInputRef.current?.click()}
                className="bg-[#181820] hover:bg-[#20202c] border border-[#262634] hover:border-blue-500/40 p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-md">OCR الذكي</span>
                  <h4 className="text-sm font-bold text-white mt-1">تحويل الصورة إلى نص</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">استخراج النصوص العربية بدقة</p>
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-2 gap-5">
            
            {/* Preference Settings */}
            <div className="bg-[#181820] border border-[#262634] rounded-2xl p-5 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white pb-3 border-b border-white/10">التفضيلات العامة</h3>
              
              <div 
                onClick={() => setShowLanguageModal(true)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#20202a] hover:bg-[#262634] cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-bold text-white">اللغة</span>
                </div>
                <span className="text-xs text-zinc-400">{language === 'ar' ? 'العربية' : 'English'}</span>
              </div>
            </div>

            {/* Contact & Support */}
            <div className="bg-[#181820] border border-[#262634] rounded-2xl p-5 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white pb-3 border-b border-white/10">الدعم والتواصل المباشر</h3>
              
              <div 
                onClick={() => {
                  window.location.href = 'mailto:zaidbnihani73@gmail.com';
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#20202a] hover:bg-[#262634] cursor-pointer transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">البريد الالكتروني للتواصل</h4>
                  <p className="text-xs text-blue-400 select-all font-sans mt-0.5">zaidbnihani73@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#20202a] hover:bg-[#262634] cursor-pointer transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">قناة تيليجرام</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">التواصل والدعم الفني المباشر</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
