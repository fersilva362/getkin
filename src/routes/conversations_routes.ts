import { Router } from "express";
import {
  addMessageToConversation,
  fetchConversationByUserId,
} from "../controllers/conversation_controller.js";
import { auth_verification } from "../middleware/express_authorization.js";

const conversation_route = Router();
conversation_route.get(
  "/conversations/:conversation_id",
  auth_verification,
  fetchConversationByUserId,
);
conversation_route.post(
  "/conversations/:conversation_id",
  auth_verification,
  addMessageToConversation,
);

export default conversation_route;
