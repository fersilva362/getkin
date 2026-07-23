import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { MyContactModel, MyUserModel } from "../models/mongo_db_models.js";
import { AuthenticatedRequest } from "../middleware/express_authorization.js";
export const fetchContacts = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const { id: user_id } = req.user;
  try {
    const result = await MyContactModel.find({
      owner: user_id,
    });

    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching contacts." });
  }
};
export const addContact = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const { id: user_id } = req.user;
  if (!req.body) {
    res.status(400).json({ message: "Request body is missing." });
    return;
  }
  const { contactEmail, username } = req.body;
  if (!contactEmail || !username) {
    res
      .status(400)
      .json({ message: "contactEmail and username are required." });
    return;
  }

  const check_foreign_user = await MyUserModel.findOne({
    contact_email: contactEmail,
  });

  if (!check_foreign_user) {
    res
      .status(400)
      .json({ message: "your contact doesnt have an account in our server." });
    return;
  }

  try {
    const existingContact = await MyContactModel.findOne({
      owner: user_id,
      contact_email: contactEmail,
    });

    if (existingContact) {
      res.status(400).json({
        message: "You already have a contact added with this email address.",
        data: existingContact,
      });
      return;
    }
    const uuid = randomUUID();
    const newContact = {
      conversation_id: uuid,
      participant_name: username,
      contact_email: contactEmail,
      owner: user_id,
      last_message_time: new Date().toISOString(),
    };

    const result = await MyContactModel.create(newContact);
    res.status(201).json({
      message: "Contact successfully created.",
      contact: result,
    });
  } catch (error) {
    console.log("Error: " + error);
    res
      .status(500)
      .json({ message: "Internal server error while creating contact." });
  }
};
