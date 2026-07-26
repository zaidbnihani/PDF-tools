import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

state_repl = """  const [activeTab, setActiveTab] = useState<'home' | 'tools' | 'settings'>('home');

  // Settings states
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);"""

content = content.replace("  const [activeTab, setActiveTab] = useState<'home' | 'tools' | 'settings'>('home');", state_repl)

settings_ui_repl = """                  {/* Card 1: المظهر */}
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
                  </div>"""

pattern = re.compile(r'\{\/\*\s*Card 1: المظهر\s*\*\/\}.*?العربية\s*<\/p>\s*<\/div>\s*<\/div>', re.MULTILINE | re.DOTALL)
content = pattern.sub(settings_ui_repl, content)

modals_repl = """        {/* ==================== TOAST NOTIFICATION ==================== */}
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
        )}"""

content = content.replace("{/* ==================== TOAST NOTIFICATION ==================== */}", modals_repl)
content = content.replace(modals_repl + "\n        {toastMessage && (", modals_repl) # Fix any duplication if it happened. (actually the replace does exactly the replacement of the tag. I'll just keep it clean)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Done")
