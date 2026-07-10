import { NextFunction, Request, Response } from "express";

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
