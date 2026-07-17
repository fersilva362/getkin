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

const message_schema = z.object({
  id: z.string().optional(),
  sender_id: z.string().describe("Identifier of who sent the message"),
  created_at: z.string().optional(),
  content: z.string(),
});

const input_schema = z.object({
  owner: z.string().optional(),
  participant_name: z.string().optional(),
  messages: z.array(message_schema),
});

const output_schema = z.object({
  summary: z
    .string()
    .describe("A concise 2-3 sentence  of the overall conversation"),
  actions: z
    .array(
      z.object({
        task: z.string(),
        responsable: z
          .string()
          .describe("name of personal that perform the task"),
      }),
    )
    .optional(),
  priority: z
    .enum(["HIGH", "URGENT", "LOW"])
    .describe("the relevance of attending this message")
    .optional(),
});

export const summarize_conversation_by_id = ai.defineFlow(
  /*  {
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
  }, */

  {
    name: "sumarize conversation by ID",
    inputSchema: input_schema,
    outputSchema: output_schema,
  },
  async ({ messages, owner, participant_name }) => {
    const { output } = await ai.generate({
      model: googleAI.model("gemini-flash-lite-latest"),
      prompt: `Summarize these messsages for user ${owner}: ${JSON.stringify(messages)}`,
      output: { schema: output_schema },
    });

    if (!output) {
      throw new Error("Model failed to generate structured summary.");
    }
    console.log(output);
    return output;
  },
);

/* conversation_id:
  contact_email: 
  owner: 
  participant_name: 
  last_message: 
  last_message_time:
  messages: { type: [MessageSchema], require: true, default: [] }, */
