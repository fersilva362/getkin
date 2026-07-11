import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.SECRET_JWT_KEY || "nada";
export const auth_login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username && username === "fer" && password && password === "123") {
    var token = jwt.sign({ foo: "bar" }, JWT_SECRET, { expiresIn: "30d" });
    res.status(200).json({ token });
    return;
  }
  res.status(400).send("invalid password or username");
};
