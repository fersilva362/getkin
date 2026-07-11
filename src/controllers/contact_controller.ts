import { Request, Response } from "express";
import { myContacts } from "../data/data_contacts";
import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { ContactSchema, MyContactModel } from "../models/mongo_db_models.js";
import { UUID } from "node:crypto";

export const fetchContacts = async (req: Request, res: Response) => {
  try {
    const result = await MyContactModel.find();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const addContact = async (req: Request, res: Response) => {
  const uuid = randomUUID();
  //Assume que el usuario esta formando parte de la base de datos (ya tiene su propio userID y aca solo lo busco agregar a mi contactos) caso contrario deberia
  const { contactEmail, username } = req.body;

  const newContact = {
    conversation_id: uuid,
    participant_name: username,
    contact_email: contactEmail,
    last_message_time: new Date().toISOString(),
  };

  try {
    const result = await MyContactModel.create(newContact);
    res.status(201).json({ message: "Contact succesfully created" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
