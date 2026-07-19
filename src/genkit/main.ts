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
import { PDFParse } from "pdf-parse";
import { readFile } from "fs/promises";
import { chunk } from "llm-chunk";
import { Document } from "genkit/retriever";
import devLocalVectorstore from "@genkit-ai/dev-local-vectorstore";
import "dotenv/config";

export const ai = genkit({
  plugins: [
    // googleAI provides the gemini-embedding-001 embedder
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),

    // the local vector store requires an embedder to translate from text to vector
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
      console.log(pdfText);
      const chunkText = await ai.run("chunk-it", async () =>
        chunk(pdfText, chunkingConfig),
      );
      const documents = chunkText.map((text) =>
        Document.fromText(text, { filePath }),
      );
      console.log(documents);
      await ai.index({
        indexer: menuPdfIndexer,
        documents,
      });
      console.log("mmmm");
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
      model: googleAI.model("gemini-flash-lite-latest"),
      prompt: `You are an operational evaluator. 
Provide a clear, 1-2 sentence evaluation of the conversation summary based on the retrieved documents.
DO NOT use meta-phrases like "Based on the provided information" or "The document states".
If the documents do not contain relevant shift/role information, simply state: "No official policy record found for the referenced individual.

Question: ${summary}`,
      docs,
    });
    console.log(text);
    return text.replace(/\s+/g, " ");
  },
);
