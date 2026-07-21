# Genkit Conversation AI Service

A backend service built with Node.js, Express, TypeScript, and MongoDB, leveraging the **Genkit** framework and **Google GenAI (Gemini)** to process, analyze, and generate structured summaries of user conversations.

---

## Features

- **Structured AI Summarization:** Custom Genkit Flow (`summarize_conversation_by_id`) utilizing the `gemini-flash-lite-latest` model to distill text into clear summaries, action items, and priority evaluations.
  🎯Indexing & Retrieval Flow (menuQAFlow): It indexes PDF content (skills.pdf) into a local vector store (menuQA) using gemini-embedding-001 embeddings. When triggered, it retrieves relevant passages using summary as a query and feeds them as ground context (docs) to gemini-flash-lite-latest to evaluate compliance or policy records. Summarization Flow (summarize_conversation_by_id): It takes chat messages, uses Genkit’s structured output schema to extract a summary, task list, and priority, and then invokes menuQAFlow to automatically evaluate the extracted summary against the indexed knowledge store before returning the complete result.

- **Routing Architecture:** Modular architecture separating Controllers, Routes, and Data Models for scalable API expansions (Auth, Contacts, and Conversations).
- **Database & Authentication:** Mongoose/MongoDB backend schema mappings integrated with JWT validation middleware.
- **Document Processing:** Equipped with `pdf-parse` and `@napi-rs/canvas` handling capabilities for advanced pipeline ingestions.

---

## Tech Stack & Dependencies

- **Language:** Node.js (ES Modules), TypeScript, `tsx` (TypeScript Execute)
- **AI Core:** `genkit`, `@genkit-ai/google-genai`, `@genkit-ai/dev-local-vectorstore`
- **Framework & Auth:** Express 5.x, JSONWebTokens (`jsonwebtoken`), `bcrypt`
- **Database:** Mongoose / MongoDB Atlas
- **Utilities:** `dotenv`, `pdf-parse`, `llm-chunk`, `@napi-rs/canvas`

---

## Project Structure

```text
├── src/
│   ├── controllers/             # Express controllers (auth, contacts, conversations)
│   ├── data/                    # Local storage or persistent assets
│   ├── genkit/
│   │   ├── main.ts              # Core Genkit configuration & entry point
│   │   └── summarize_conversations.ts # Genkit Flow definitions (Gemini Schemas)
│   ├── middleware/              # Express authorization & validation filters
│   ├── models/                  # MongoDB Mongoose models
│   ├── routes/                  # Express Router pipelines mapping to endpoints
│   └── index.ts                 # Main server entry file
├── .env                         # Local environment configuration variables
├── vercel.json                  # Cloud deployment configuration
└── package.json                 # Project manifest and scripts
```
