import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_JWT_KEY || "nada";

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
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const auth_header = req.headers["authorization"]?.split(" ")[1];

  if (!auth_header) {
    res.status(400).send("empty headers");
  }
  const user_data = JWT.verify(auth_header!, JWT_SECRET);
  if (!user_data || typeof user_data == "string") {
    res.status(400).send("error in headers");
    return;
  }
  next();
};
