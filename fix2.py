import re
with open('src/App.tsx', 'r') as f:
    text = f.read()

text = re.sub(r'        \)}\s*<div className="fixed bottom-24', '        {toastMessage && (\n          <div className="fixed bottom-24', text)

with open('src/App.tsx', 'w') as f:
    f.write(text)
