import { Router } from "express";
import { summarizeConversation } from "../controllers/conversation_controller";

export const summarizer_route = Router();

summarizer_route.get("/summarize/:conversation_id", summarizeConversation);
