with open('src/App.tsx', 'r') as f:
    text = f.read()

# remove everything from first TOAST NOTIFICATION to end of file
import re
text = re.sub(r'\{\/\* ==================== TOAST NOTIFICATION ==================== \*\/\}[\s\S]*$', '', text)

# add it back cleanly
clean_end = """        {/* ==================== TOAST NOTIFICATION ==================== */}
        {toastMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] px-5 py-2.5 bg-[#1c1c20] text-white text-sm font-semibold rounded-full shadow-lg shadow-black/50 border border-[#23232a] pointer-events-none text-center whitespace-nowrap">
            {toastMessage}
          </div>
        )}

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
    </div>
  );
}
"""

with open('src/App.tsx', 'w') as f:
    f.write(text + clean_end)
