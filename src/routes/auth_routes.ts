import { Router } from "express";
import {
  auth_delete,
  auth_login,
  auth_register,
} from "../controllers/auth_controller.js";

export const auth_route = Router();
auth_route.post("/login", auth_login);
auth_route.post("/register", auth_register);
auth_route.delete("/delete-user", auth_delete);
