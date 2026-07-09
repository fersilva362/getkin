import { Router } from "express";
import {
  addMessageToConversation,
  fetchConversationByUserId,
} from "../controllers/conversation_controller";

const conversation_route = Router();
conversation_route.get(
  "/conversations/:conversation_id",
  fetchConversationByUserId,
);
conversation_route.post(
  "/conversations/:conversation_id",
  addMessageToConversation,
);
export default conversation_route;
