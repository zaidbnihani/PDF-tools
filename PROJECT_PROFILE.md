# ملف تعريف المشروع

## العربية

### الغرض والنطاق
يصف README المشروع بأنه موقع عربي مجاني لمجموعة أدوات PDF. وتدعم تفاصيل التنفيذ وجود واجهة ويب لمعالجة مستندات PDF والصور، مع خادم Node/Express لواجهات استخراج النص وحماية/فك حماية PDF. تُذكر في README ميزات إضافية؛ لكن هذا الملف يميز بين ما يعلنه README وما يظهر في تدفق التطبيق، إذ توحي بعض معالجات الواجهة بعناصر أولية أو رسائل نجاح شكلية لا بعملية مكتملة. الأدلة: `README.md`، `src/App.tsx`، `server.ts`.

### المكونات والتدفقات الأساسية
- نقطة الدخول `src/main.tsx` تركّب `src/App.tsx` ضمن React `StrictMode`، وتحمّل `src/index.css`.
- `src/App.tsx` ينسق حالة التطبيق ومعالجة الملفات. يظهر في الشيفرة تدفق لدمج ملفات PDF وإعادة ترتيب الصفحات واستخراجها وحذفها وتدويرها وتقسيمها، وتحويل PDF إلى صور (مع أرشفة النتائج عبر JSZip)، وتحويل الصور إلى PDF، والضغط. يستخدم `pdf-lib` و`pdfjs-dist` و`jspdf` و`file-saver` و`jszip` بحسب الاستيرادات ومواضع المعالجة.
- الواجهة مقسمة حسب عامل الشكل: `src/components/DesktopInterface.tsx` و`src/components/TabletInterface.tsx`؛ ويعرض `src/components/MergeFileCard.tsx` بطاقة ملف قابلة للسحب وإعادة الترتيب، بينما `src/components/DocumentScannerModal.tsx` يتعامل مع الكاميرا والتقاط صور المسح وإنشاء PDF.
- يقدّم `server.ts` خادم Express على المنفذ `3000`: في التطوير يمرر الطلبات إلى Vite middleware، وفي الإنتاج يخدم `dist`. يستقبل `/api/extract-text` بيانات الصورة/PDF ويرسلها إلى Google GenAI؛ وتستخدم `/api/protect-pdf` و`/api/unlock-pdf` أداة النظام `qpdf` لمعالجة الملفات المؤقتة، مع تنظيف ملفات `/tmp` بعد المعالجة.
- يضبط `vite.config.ts` ملحقي React وTailwind CSS لـVite، واسم المسار `@`؛ كما يضبط `DISABLE_HMR` سلوك HMR ومراقبة الملفات.

### شجرة مختصرة
```text
.
├── README.md                         وصف الميزات المعلن
├── package.json / bun.lock           أوامر المشروع واعتمادياته وقفلها
├── index.html                        صفحة HTML عربية RTL ونقطة تركيب الواجهة
├── server.ts                         خادم Express وواجهات API وتكامل GenAI/qpdf
├── vite.config.ts / tsconfig.json    إعدادات Vite وTypeScript
├── metadata.json                     بيانات التطبيق وصلاحية الكاميرا المعلنة
├── src/
│   ├── main.tsx                      مدخل React
│   ├── App.tsx                       الحالة وتدفقات معالجة الملفات
│   ├── index.css                     استيراد Tailwind CSS
│   └── components/
│       ├── DesktopInterface.tsx      واجهة سطح المكتب
│       ├── TabletInterface.tsx       واجهة الجهاز اللوحي
│       ├── DocumentScannerModal.tsx  تدفق مسح المستندات بالكاميرا
│       └── MergeFileCard.tsx          بطاقة ملف الدمج وإعادة الترتيب
├── .env.example                      أسماء متغيرات البيئة النموذجية فقط
└── clean.py, fix*.py, rewrite.py,
    update_settings.py                سكربتات مساعدة لتعديل App.tsx وليست أوامر تشغيل
```

### الملفات المحورية
- `README.md`: قائمة الإمكانات المعلنة للمستخدم.
- `package.json` و`bun.lock`: تعريف الحزمة والاعتماديات والمهام؛ اسم الحزمة الحالي `react-example` وإصدارها `0.0.0`.
- `src/App.tsx` و`server.ts`: تدفقات المعالجة في المتصفح وواجهات الخادم.
- `vite.config.ts` و`tsconfig.json`: إعدادات الأدوات ومسار الاستيراد `@/*`.
- `metadata.json`: اسم/وصف عربيان وتصريح إطار الكاميرا.
- سكربتات Python الجذرية مثل `clean.py` و`fix.py` و`rewrite.py` و`update_settings.py` تقرأ/تكتب `src/App.tsx`؛ تبدو أدوات تعديل يدوية تاريخية، ولا توجد لها مهمة تشغيل في `package.json`.

### التقنية والإصدارات والاعتماديات
المستودع يستخدم React `^19.0.1` وReact DOM `^19.0.1` وTypeScript `~5.8.2` وVite `^6.2.3` وExpress `^4.21.2` و`tsx ^4.21.0` و`esbuild ^0.25.0`، مع Tailwind CSS `^4.1.14` وملحق Vite الخاص به `^4.1.14`. تشمل الاعتماديات الوظيفية `pdf-lib ^1.17.1` و`pdfjs-dist 3.11.174` و`react-pdf ^10.4.1` و`jspdf ^4.2.1` و`jszip ^3.10.1` و`file-saver ^2.0.5` و`@google/genai ^2.4.0` و`dotenv ^17.2.3`، إضافة إلى Motion وLucide React. هذه نطاقات الإصدارات المحددة في `package.json`، ويحتوي `bun.lock` على القفل. لا يحدد المستودع إصدار Node.js.

### الإعداد والتشغيل والاختبار والبناء
`package.json` يوثق الأوامر التالية (لم تُشغّل أثناء إعداد هذا الملف):
- `bun run dev` لتشغيل `tsx server.ts` في وضع التطوير، مع تحميل `dotenv` في الخادم.
- `bun run build` لتشغيل `vite build` ثم تجميع `server.ts` عبر esbuild إلى `dist/server.cjs`.
- `bun run start` لتشغيل `node dist/server.cjs` بعد البناء.
- `bun run lint` لتشغيل `tsc --noEmit`؛ الاسم هو `lint` لكنه فحص TypeScript لا أداة lint منفصلة.
- `bun run clean` لحذف `dist` و`server.js`.

يذكر `.env.example` اسمي متغيري الإعداد `GEMINI_API_KEY` و`APP_URL`؛ لا تُسجّل هنا أي قيم. يحتاج خادم حماية/فك حماية PDF إلى وجود `qpdf` في النظام (`server.ts`). يحدد الخادم المنفذ `3000` مباشرةً. لا توجد في الشجرة ملفات اختبار واضحة ولا ملفات GitHub Actions/CI، ولا توجد تعليمات تثبيت مستقلة في README؛ لذلك لم تُخترع أوامر إعداد أخرى.

### إرشادات للمطور ونقاط غير محسومة
ابدأ بمراجعة `package.json` و`README.md` ثم تتبع التدفق المطلوب في `src/App.tsx` أو `server.ts`. استخدم الأوامر أعلاه كما هي موثقة؛ يلزم توفير `GEMINI_API_KEY` لاستخدام استخراج النص عبر Gemini وتهيئة `qpdf` لوظائف حماية PDF. تدل `metadata.json` على أن التطبيق يطلب إذن الكاميرا. لم يُحدد README أو manifests إصدار Node/Bun أو منصة نشر. كما أن README يسرد ميزات أوسع من بعض السلوك الظاهر في الواجهة؛ تحقّق من الوظيفة الفعلية قبل اعتبار كل عنصر مكتملًا. لا توجد اختبارات آلية أو CI ظاهرة في النسخة التي تمت مراجعتها.

## English

### Purpose and scope
The README describes the project as a free Arabic website providing a set of PDF tools. The implementation supports a web interface for working with PDF documents and images, plus a Node/Express server for text-extraction and PDF protection/unprotection APIs. The README lists additional capabilities; this profile distinguishes those claims from behavior visible in the application, since some UI handlers appear to be placeholders or present simulated success messages rather than complete processing. Evidence: `README.md`, `src/App.tsx`, `server.ts`.

### Main components and flows
- `src/main.tsx` mounts `src/App.tsx` under React `StrictMode` and loads `src/index.css`.
- `src/App.tsx` coordinates application state and file processing. The code includes flows for merging PDFs, reordering/extracting/deleting/rotating/splitting pages, converting PDF pages to images (archiving results with JSZip), converting images to PDF, and compression. Imports and processing sites show use of `pdf-lib`, `pdfjs-dist`, `jspdf`, `file-saver`, and `jszip`.
- The UI is split by form factor: `src/components/DesktopInterface.tsx` and `src/components/TabletInterface.tsx`. `src/components/MergeFileCard.tsx` renders a draggable/reorderable file card, while `src/components/DocumentScannerModal.tsx` handles camera access, scan capture, and PDF creation.
- `server.ts` provides an Express server on port `3000`: in development it uses Vite middleware; in production it serves `dist`. `/api/extract-text` sends image/PDF data to Google GenAI; `/api/protect-pdf` and `/api/unlock-pdf` use the system `qpdf` executable to process temporary files and clean up files under `/tmp` afterward.
- `vite.config.ts` configures the React and Tailwind CSS Vite plugins and the `@` path alias; `DISABLE_HMR` controls HMR and file watching.

### Short directory and file map
```text
.
├── README.md                         Declared feature overview
├── package.json / bun.lock           Project scripts, dependencies, and lockfile
├── index.html                        Arabic RTL HTML page and UI mount point
├── server.ts                         Express server, APIs, GenAI/qpdf integration
├── vite.config.ts / tsconfig.json    Vite and TypeScript configuration
├── metadata.json                     App metadata and declared camera permission
├── src/
│   ├── main.tsx                      React entry point
│   ├── App.tsx                       State and file-processing flows
│   ├── index.css                     Tailwind CSS import
│   └── components/
│       ├── DesktopInterface.tsx      Desktop interface
│       ├── TabletInterface.tsx       Tablet interface
│       ├── DocumentScannerModal.tsx  Camera document-scan flow
│       └── MergeFileCard.tsx          Merge-file card and reordering
├── .env.example                      Example environment variable names only
└── clean.py, fix*.py, rewrite.py,
    update_settings.py                App.tsx editing helpers, not run commands
```

### Key files
- `README.md`: user-facing list of advertised capabilities.
- `package.json` and `bun.lock`: package metadata, dependencies, and scripts; the current package name is `react-example` and its version is `0.0.0`.
- `src/App.tsx` and `server.ts`: browser-side processing flows and server APIs.
- `vite.config.ts` and `tsconfig.json`: tooling settings and the `@/*` import path.
- `metadata.json`: Arabic app name/description and camera-frame permission declaration.
- Root Python scripts such as `clean.py`, `fix.py`, `rewrite.py`, and `update_settings.py` read/write `src/App.tsx`; they appear to be historical manual-edit helpers and have no run script in `package.json`.

### Technology, versions, and dependencies
The repository uses React `^19.0.1`, React DOM `^19.0.1`, TypeScript `~5.8.2`, Vite `^6.2.3`, Express `^4.21.2`, `tsx ^4.21.0`, and `esbuild ^0.25.0`, with Tailwind CSS `^4.1.14` and its Vite plugin `^4.1.14`. Functional dependencies include `pdf-lib ^1.17.1`, `pdfjs-dist 3.11.174`, `react-pdf ^10.4.1`, `jspdf ^4.2.1`, `jszip ^3.10.1`, `file-saver ^2.0.5`, `@google/genai ^2.4.0`, and `dotenv ^17.2.3`, plus Motion and Lucide React. These are the ranges declared in `package.json`; `bun.lock` provides the lockfile. The repository does not specify a Node.js version.

### Setup, running, testing, and building
`package.json` documents the following commands (they were not run while preparing this profile):
- `bun run dev` runs `tsx server.ts` in development mode, with `dotenv` loaded by the server.
- `bun run build` runs `vite build`, then bundles `server.ts` with esbuild to `dist/server.cjs`.
- `bun run start` runs `node dist/server.cjs` after building.
- `bun run lint` runs `tsc --noEmit`; despite its name, this is a TypeScript check, not a separate lint tool.
- `bun run clean` removes `dist` and `server.js`.

`.env.example` names two configuration variables: `GEMINI_API_KEY` and `APP_URL`; no values are recorded here. The PDF protection/unprotection server paths require the system `qpdf` executable (`server.ts`). The server hard-codes port `3000`. There are no obvious test files or GitHub Actions/CI files in the tree, and README has no separate installation instructions, so no other setup commands are inferred.

### New-developer notes and open questions
Start by reviewing `package.json` and `README.md`, then follow the relevant flow in `src/App.tsx` or `server.ts`. Use only the commands documented above; Gemini-based text extraction requires `GEMINI_API_KEY`, and PDF protection features require `qpdf` to be installed. `metadata.json` indicates that the app requests camera permission. The README and manifests do not specify Node/Bun versions or a deployment platform. Also, the README lists more features than some visible UI behavior supports; verify each flow before treating it as complete. No automated tests or CI are evident in the reviewed checkout.
