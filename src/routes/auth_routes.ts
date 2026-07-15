import { Router } from "express";
import { auth_login } from "../controllers/auth_controller";
import { auth_verification } from "../middleware/express_authorization";

export const auth_route = Router();
auth_route.post("/login", auth_login);
auth_route.get("/login", auth_verification);
