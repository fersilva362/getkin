import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { MyContactModel } from "../models/mongo_db_models.js";
import { AuthenticatedRequest } from "../middleware/express_authorization.js";
//const user_id = "6a56b5b4fd0d20e3de9fc433";
export const fetchContacts = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const { id: user_id } = req.user;
  console.log(user_id);
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
  const { contactEmail, username } = req.body;

  try {
    if (!contactEmail || !username) {
      res
        .status(400)
        .json({ message: "contactEmail and username are required." });
      return;
    }

    const existingContact = await MyContactModel.findOne({
      owner: user_id,
      contact_email: contactEmail,
    });

    if (existingContact) {
      res.status(400).json({
        message: "You already have a contact added with this email address.",
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
