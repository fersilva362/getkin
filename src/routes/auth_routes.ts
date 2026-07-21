import { Router } from "express";
import {
  auth_delete,
  auth_fetch,
  auth_login,
  auth_register,
} from "../controllers/auth_controller.js";
import { auth_verification } from "../middleware/express_authorization.js";

export const auth_route = Router();
auth_route.post("/login", auth_login);
auth_route.post("/register", auth_register);
auth_route.delete("/delete-user", auth_verification, auth_delete);
auth_route.get("/", auth_verification, auth_fetch);
