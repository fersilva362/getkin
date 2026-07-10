import { Router } from "express";
import { summarizeConversation } from "../controllers/conversation_controller";
import { auth_by_express } from "../middleware/express_authorization";

export const summarizer_route = Router();

summarizer_route.get(
  "/summarize/:conversation_id",
  auth_by_express,
  summarizeConversation,
);
