if (typeof globalThis.DOMMatrix === "undefined") {
  (globalThis as any).DOMMatrix = class DOMMatrix {};
}
if (typeof globalThis.ImageData === "undefined") {
  (globalThis as any).ImageData = class ImageData {};
}
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import {
  devLocalIndexerRef,
  devLocalRetrieverRef,
} from "@genkit-ai/dev-local-vectorstore";
import path from "path";
import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import { readFile } from "fs/promises";
import { chunk } from "llm-chunk";
import { Document } from "genkit/retriever";
import { devLocalVectorstore } from "@genkit-ai/dev-local-vectorstore";
import "dotenv/config";

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
    devLocalVectorstore([
      {
        indexName: "menuQA",
        embedder: googleAI.embedder("gemini-embedding-001"),
      },
    ]),
  ],
});

export const menuPdfIndexer = devLocalIndexerRef("menuQA");

async function extractPdf(filePath: string) {
  const pdfFile = path.resolve(filePath);
  const dataBuffer = await readFile(pdfFile);

  const parser = new PDFParse({ data: dataBuffer });

  const data = await parser.getText();
  return data.text;
}
const chunkingConfig = {
  minLength: 1000,
  maxLength: 2000,
  splitter: "sentence",
  overlap: 100,
  delimiters: "",
} as any;

export const indexMenu = ai.defineFlow(
  {
    name: "indexer Document Fer",
    inputSchema: z.string().describe("PDF file"),
    outputSchema: z.void(),
  },
  async (filePath) => {
    try {
      filePath = path.resolve(filePath);
      const pdfText = await ai.run("Extract Pdf", () => extractPdf(filePath));
      const chunkText = await ai.run("chunk-it", async () =>
        chunk(pdfText, chunkingConfig),
      );
      const documents = chunkText.map((text) =>
        Document.fromText(text, { filePath }),
      );
      await ai.index({
        indexer: menuPdfIndexer,
        documents,
      });
    } catch (error) {
      console.log(error);
    }
  },
);

export const menuRetriever = devLocalRetrieverRef("menuQA");
export const menuQAFlow = ai.defineFlow(
  {
    name: "retrieve documents",
    inputSchema: z.object({
      summary: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ summary }): Promise<string> => {
    const docs = await ai.retrieve({
      retriever: menuRetriever,
      query: summary,
      options: { k: 5 },
    });

    const { text } = await ai.generate({
      model: googleAI.model("gemini-3.1-flash-lite"),
      prompt: `You are an experienced human resources specialist tasked with analyzing workforce alignment in operational settings. Please evaluate whether the personnel allocations, assigned tasks, and shift schedules outlined in the summary accurately correspond with the designated roles and responsibilities detailed in the referenced document.
Respond in 1 or 2 clear, direct sentences.
Do not use phrases such as "Based on the provided information" or "The document states."
If none of the individuals mentioned in the summary appear in the retrieved document, return exactly: "No official policy record found for the referenced individual."
Otherwise, evaluate only the individuals mentioned in the summary using the retrieved document and ignore any individuals who are not present.

Question: ${summary}`,
      docs,
    });
    return text.replace(/\s+/g, " ");
  },
);
