import { NextFunction, Request, RequestHandler, Response } from "express";
import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_JWT_KEY || "nada";

export interface AuthenticatedRequest extends Request {
  user?: JWT.JwtPayload;
}
export const auth_by_express = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.log(req.headers);
  if (req.headers["authorization"] !== "tantan") {
    res.status(403).json({ error: "user authentication failed" });
    return;
  }
  console.log("ok ");
  next();
};
export const auth_verification = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const auth_header = req.headers["authorization"];
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!auth_header || !token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const user_data = JWT.verify(token!, JWT_SECRET);
    if (!user_data || typeof user_data == "string") {
      res.status(401).json({ message: "Invalid or expired token." });
      return;
    }

    //console.log(JSON.stringify(user_data) + "user_data");
    req.user = user_data;

    next();
  } catch (error) {
    console.error("JWT Verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
