with open('src/App.tsx', 'r') as f:
    text = f.read()

# fix duplicated state
import re
text = re.sub(r'  // Settings states\s*const \[theme, setTheme\] = useState<\'dark\' \| \'light\'>\(\'dark\'\);\s*const \[language, setLanguage\] = useState<\'ar\' \| \'en\'>\(\'ar\'\);\s*const \[showThemeModal, setShowThemeModal\] = useState\(false\);\s*const \[showLanguageModal, setShowLanguageModal\] = useState\(false\);\s*', '', text, count=1)

# fix 4534 }} to }
text = text.replace('        )}}', '        )}\n')

# fix 4715
text = text.replace('        )}          <div className="fixed bottom-24 left-1/2 -translate-x-1/2', '        {toastMessage && (\n          <div className="fixed bottom-24 left-1/2 -translate-x-1/2')

with open('src/App.tsx', 'w') as f:
    f.write(text)
