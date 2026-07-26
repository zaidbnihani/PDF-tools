with open('src/App.tsx', 'r') as f:
    text = f.read()

text = text.replace('        {toastMessage && (', '        )}\n        {toastMessage && (')

with open('src/App.tsx', 'w') as f:
    f.write(text)
