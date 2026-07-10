import devLocalVectorstore from "@genkit-ai/dev-local-vectorstore";
import { googleAI } from "@genkit-ai/google-genai";
import { genkit, z } from "genkit";

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
});
export const summarize_conversation_by_id = ai.defineFlow(
  {
    name: "sumarize conversation by ID",
    inputSchema: z.object({
      messages: z.array(
        z.object({
          id: z.string().describe("id message"),
          content: z.string(),
          sender_id: z.string().describe("who is the sender of message"),
          created_at: z.string(),
        }),
      ),
    }),
    outputSchema: z.string(),
  },
  async ({ messages }) => {
    const { text } = await ai.generate({
      model: googleAI.model("gemini-flash-lite-latest"),
      prompt: `Summarize the content of this messages (content) with me (I am userID : 96)  ${JSON.stringify(messages)}`,
    });
    console.log(text);
    return text;
  },
);
