import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { MyUserModel } from "../models/mongo_db_models";

const JWT_SECRET = process.env.SECRET_JWT_KEY || "nada";
export const auth_login = async (req: Request, res: Response) => {
  const { contactEmail, password } = req.body;
  if (!contactEmail || !password) {
    res.status(400).send("error in username or password");
    return;
  }

  const user_searched_list = await MyUserModel.find({
    contact_email: contactEmail,
  });
  if (!user_searched_list[0]) {
    res.status(400).send("error in finding user");
    return;
  }
  if (user_searched_list[0].password !== password) {
    res.status(400).send("error in passoword");
    return;
  }
  const user_db = user_searched_list[0];

  var token = jwt.sign({ contactEmail, password }, JWT_SECRET, {
    expiresIn: "30d",
  });
  const myUser = { ...user_db };

  res
    .status(200)
    .json({
      token,
      user: { username: user_db["username"], contact_email: contactEmail },
    });
};
