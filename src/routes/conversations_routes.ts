import { Router } from "express";
import { fetchConversationByUserId } from "../controllers/conversation_controller";

const conversation_route = Router();
conversation_route.get(
  "/conversations/:conversation_id",
  fetchConversationByUserId,
);

export default conversation_route;
