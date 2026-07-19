import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { MyUserModel } from "../models/mongo_db_models.js";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.SECRET_JWT_KEY;
const SALT_ROUND = Number(process.env.SALT_ROUND_JWT);

export const auth_login = async (req: Request, res: Response) => {
  const { contactEmail, password } = req.body;
  if (!JWT_SECRET) {
    res.status(500).json({ message: "internal server error." });
    return;
  }
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
    const { id, username } = user_searched;

    //CAMBIAR TOKEN EXPIRE
    var token = jwt.sign({ contactEmail, id, username }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: {
        id: id,
        username: username,
        contact_email: contactEmail,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "An internal server error occurred.", error });
  }
};

export const auth_register = async (req: Request, res: Response) => {
  if (!JWT_SECRET) {
    res.status(500).json({ message: "internal server error." });
    return;
  }
  const { contactEmail, password, username } = req.body;

  if (!contactEmail || !password || !username) {
    res
      .status(400)
      .json({ message: "Username, email, and password are required." });
    return;
  }

  try {
    const user_searched = await MyUserModel.findOne({
      contact_email: contactEmail,
    });

    if (user_searched) {
      res
        .status(401)
        .json({ message: "A user with this email already exists." });
      return;
    }
    const password_hashed = await bcrypt.hash(password, SALT_ROUND);
    await MyUserModel.create({
      password: password_hashed,
      username,
      contact_email: contactEmail,
    });

    res.status(201).json({
      message: "User created successfully.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const auth_delete = async (req: Request, res: Response) => {
  const { contactEmail, password } = req.body;
  if (!JWT_SECRET) {
    res.status(500).json({ message: "internal server error." });
    return;
  }
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

    await MyUserModel.deleteOne({ contact_email: contactEmail });

    res.status(200).json({
      message: "user succesfully deleted",
    });
  } catch (error) {
    console.error("Deleting user error:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};
