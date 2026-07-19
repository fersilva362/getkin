# Genkit Conversation AI Service

A backend service built with Node.js, Express, TypeScript, and MongoDB, leveraging the **Genkit** framework and **Google GenAI (Gemini)** to process, analyze, and generate structured summaries of user conversations.

---

## Features

- **Structured AI Summarization:** Custom Genkit Flow (`summarize_conversation_by_id`) utilizing the `gemini-flash-lite-latest` model to distill text into clear summaries, action items, and priority evaluations.
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
