import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { MyContactModel } from "../models/mongo_db_models.js";
const user_id = "6a56b5b4fd0d20e3de9fc433";
export const fetchContacts = async (req: Request, res: Response) => {
  try {
    const result = await MyContactModel.find({
      owner: user_id,
    });
    if (!result) {
      res.status(401).json({ message: "Unauthorized user." });
      return;
    }
    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
export const addContact = async (req: Request, res: Response) => {
  const uuid = randomUUID();
  //Assume que el usuario existe en la base de datos (ya tiene su propio userID y aca solo lo busco agregar a mi contactos)
  const { contactEmail, username } = req.body;

  try {
    if (!contactEmail || !username) {
      res
        .status(400)
        .json({ message: "contactEmail and username are required." });
      return;
    }
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
