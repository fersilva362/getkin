import { Router } from "express";
import { auth_login, auth_register } from "../controllers/auth_controller";

export const auth_route = Router();
auth_route.post("/login", auth_login);
auth_route.post("/register", auth_register);
