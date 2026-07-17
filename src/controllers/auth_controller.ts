import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { MyUserModel } from "../models/mongo_db_models";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.SECRET_JWT_KEY || "nada";

export const auth_login = async (req: Request, res: Response) => {
  const { contactEmail, password } = req.body;
  try {
    if (!contactEmail || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }
    const user_searched = await MyUserModel.findOne({
      contact_email: contactEmail,
    });

    if (!user_searched) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user_searched.password,
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }
    var token = jwt.sign({ contactEmail }, JWT_SECRET, {
      expiresIn: "300d",
    });
    res.status(200).json({
      token,
      user: {
        username: user_searched["username"],
        contact_email: contactEmail,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};
