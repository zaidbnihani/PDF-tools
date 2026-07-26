import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

protect_replacement = """        {showProtectModal && selectedProtectFile && (
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
                    setProtectConfirmPassword('');
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
        )}"""

unlock_replacement = """        {showUnlockModal && selectedUnlockFile && (
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
        )}"""

# Replace showProtectModal
pattern_protect = re.compile(r'\{\s*showProtectModal\s*&&\s*\([\s\S]*?{/\*\s*==================== UNLOCK PDF MODAL ====================\s*\*/}', re.MULTILINE)
new_content = pattern_protect.sub(protect_replacement + '\n\n        {/* ==================== UNLOCK PDF MODAL ==================== */}', content)

# Replace showUnlockModal
pattern_unlock = re.compile(r'\{\s*showUnlockModal\s*&&\s*\([\s\S]*?{/\*\s*Bottom Action Footer\s*\*/}[\s\S]*?\}\s*</div>\s*</div>\s*\)', re.MULTILINE)
new_content2 = pattern_unlock.sub(unlock_replacement, new_content)

with open('src/App.tsx', 'w') as f:
    f.write(new_content2)

print("Done")
