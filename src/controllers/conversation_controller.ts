import { Request, Response } from "express";
import { myContacts } from "../data/data_contacts";
import { randomUUID } from "node:crypto";
import { menuQAFlow } from "../genkit/main";
import { summarize_conversation_by_id } from "../genkit/summarize_conversations";
import { MyContactModel, MyMessageModel } from "../models/mongo_db_models";

export const fetchConversationByUserId = async (
  req: Request,
  res: Response,
) => {
  const { conversation_id } = req.params;
  console.log(conversation_id);
  try {
    const contact_by_conversation = await MyContactModel.find({
      conversation_id: conversation_id,
    });

    if (!contact_by_conversation[0]) {
      res.status(400).json({ messsage: "Not found conversations" });
      return;
    }
    const conversations = contact_by_conversation[0].messages;
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Failure to fetch conversations" });
  }
};

export const summarizeConversation = async (req: Request, res: Response) => {
  const { conversation_id } = req.params;
  try {
    const contact_by_conversation = await MyContactModel.find({
      conversation_id: conversation_id,
    });
    if (!contact_by_conversation[0]) {
      res.status(400).json({ messsage: "Not found conversations" });
      return;
    }
    const textSummarized = await summarize_conversation_by_id(
      contact_by_conversation[0],
    );

    console.log(textSummarized);

    res.status(200).json({ data: textSummarized });
  } catch (error) {
    res.status(500).json({ error: "Failure to fetch conversations" });
  }
};

export const addMessageToConversation = async (req: Request, res: Response) => {
  const uuid = randomUUID();
  const { conversation_id } = req.params;
  const { senderId, content } = req.body;

  const new_message = await MyMessageModel.create({
    content: content,
    sender_id: senderId,
  });
  /* const new_message = {
    
    content: content,
    sender_id: senderId,
    
  }; */
  // debo buscar por conversation y luego en message array agregar
  const targetContact = await MyContactModel.find({
    conversation_id: conversation_id,
  });

  /* const targetContact = myContacts.find(
    (c) => c.conversation_id === conversation_id,
  ); */

  if (targetContact[0]) {
    targetContact[0].messages.push(new_message);
    await targetContact[0].save();
    console.log(targetContact[0]);

    /*  targetContact.messages.push(new_message);
    targetContact.last_message = new_message.content;
    targetContact.last_message_time = new_message.created_at; */
    res
      .status(200)
      .json({ message: "success message added", data: targetContact });
  } else {
    res.status(400).send(" it seems that you dont have the contact");
  }
};

/* export const saveMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  console.log(
    `conversationId: ${conversationId} , senderId: ${senderId}, content :${content}`
  );
  try {
    const result = await pool.query(
      `INSERT INTO messages (conversation_id,sender_id ,content ) VALUES ($1,$2,$3) RETURNING *`,
      [conversationId, senderId, content]
    );
    console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    throw new Error("faile to save ");
  }
}; */
