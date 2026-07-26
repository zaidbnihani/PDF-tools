import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import { execFile } from "child_process";
import { promisify } from "util";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const execFilePromise = promisify(execFile);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for text extraction
app.post("/api/extract-text", async (req, res) => {
  try {
    const { fileData, mimeType, fileType } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: "No file data provided" });
    }

    let prompt = "Extract all text from this document. Keep the formatting as much as possible. Do not summarize, just extract the text exactly as written.";
    if (fileType === "image") {
      prompt = "Extract all text from this image. Keep the formatting as much as possible. Do not summarize, just extract the text exactly as written.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType || (fileType === "pdf" ? "application/pdf" : "image/jpeg"),
            data: fileData,
          },
        },
        prompt
      ],
    });

    const extractedText = response.text || "";
    res.json({ text: extractedText });
  } catch (error: any) {
    console.error("Error in /api/extract-text:", error);
    res.status(500).json({ error: error.message || "حدث خطأ أثناء استخراج النص من الملف باستخدام الذكاء الاصطناعي." });
  }
});

// API endpoint for password protecting/encrypting PDF using qpdf
app.post("/api/protect-pdf", async (req, res) => {
  let inputPath = "";
  let outputPath = "";
  try {
    const { fileData, password } = req.body;
    if (!fileData || !password) {
      return res.status(400).json({ error: "بيانات الملف أو كلمة المرور غير متوفرة." });
    }

    const uniqueId = crypto.randomBytes(16).toString("hex");
    inputPath = path.join("/tmp", `input_${uniqueId}.pdf`);
    outputPath = path.join("/tmp", `output_${uniqueId}.pdf`);

    const buffer = Buffer.from(fileData, "base64");
    await fs.promises.writeFile(inputPath, buffer);

    // qpdf --encrypt user-password owner-password key-length -- input.pdf output.pdf
    const args = ["--encrypt", password, password, "256", "--", inputPath, outputPath];
    await execFilePromise("qpdf", args);

    const protectedBuffer = await fs.promises.readFile(outputPath);
    const base64Protected = protectedBuffer.toString("base64");

    res.json({ fileData: base64Protected });
  } catch (error: any) {
    console.error("Error in /api/protect-pdf:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تشفير وحماية ملف PDF. يرجى المحاولة مرة أخرى." });
  } finally {
    if (inputPath && fs.existsSync(inputPath)) {
      await fs.promises.unlink(inputPath).catch(() => {});
    }
    if (outputPath && fs.existsSync(outputPath)) {
      await fs.promises.unlink(outputPath).catch(() => {});
    }
  }
});

// API endpoint for unlocking/decrypting password protected PDF using qpdf
app.post("/api/unlock-pdf", async (req, res) => {
  let inputPath = "";
  let outputPath = "";
  try {
    const { fileData, password } = req.body;
    if (!fileData || !password) {
      return res.status(400).json({ error: "بيانات الملف أو كلمة المرور غير متوفرة." });
    }

    const uniqueId = crypto.randomBytes(16).toString("hex");
    inputPath = path.join("/tmp", `input_${uniqueId}.pdf`);
    outputPath = path.join("/tmp", `output_${uniqueId}.pdf`);

    const buffer = Buffer.from(fileData, "base64");
    await fs.promises.writeFile(inputPath, buffer);

    // qpdf --password=password --decrypt input.pdf output.pdf
    const args = [`--password=${password}`, "--decrypt", inputPath, outputPath];
    await execFilePromise("qpdf", args);

    const decryptedBuffer = await fs.promises.readFile(outputPath);
    const base64Decrypted = decryptedBuffer.toString("base64");

    res.json({ fileData: base64Decrypted });
  } catch (error: any) {
    console.error("Error in /api/unlock-pdf:", error);
    const errText = (error.stderr || "") + (error.message || "");
    if (errText.toLowerCase().includes("password") || errText.toLowerCase().includes("incorrect") || errText.toLowerCase().includes("invalid")) {
      res.status(401).json({ error: "كلمة المرور غير صحيحة. يرجى التحقق وإعادة المحاولة." });
    } else {
      res.status(500).json({ error: "حدث خطأ أثناء فك حماية الملف. تأكد من صحة الملف وكلمة المرور." });
    }
  } finally {
    if (inputPath && fs.existsSync(inputPath)) {
      await fs.promises.unlink(inputPath).catch(() => {});
    }
    if (outputPath && fs.existsSync(outputPath)) {
      await fs.promises.unlink(outputPath).catch(() => {});
    }
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
