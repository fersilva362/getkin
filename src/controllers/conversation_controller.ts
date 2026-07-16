import { Request, Response } from "express";
import { myContacts } from "../data/data_contacts";
import { randomUUID } from "node:crypto";
import { menuQAFlow } from "../genkit/main";
import { summarize_conversation_by_id } from "../genkit/summarize_conversations";
import { MyContactModel, MyMessageModel } from "../models/mongo_db_models";

const user_id = "6a56b5b4fd0d20e3de9fc433";

export const fetchConversationByUserId = async (
  req: Request,
  res: Response,
) => {
  const { conversation_id } = req.params;

  try {
    const contact_by_conversation = await MyContactModel.findOne({
      conversation_id: conversation_id,
      owner: user_id,
    });

    if (!contact_by_conversation) {
      res.status(404).json({ message: "Conversation not found." });
      return;
    }
    const conversations = contact_by_conversation.messages;
    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Failure to fetch conversation." });
  }
};

export const summarizeConversation = async (req: Request, res: Response) => {
  const { conversation_id } = req.params;
  try {
    const contact_by_conversation = await MyContactModel.findOne({
      conversation_id: conversation_id,
      owner: user_id,
    });
    if (!contact_by_conversation) {
      res.status(400).json({ message: "Conversation ID is required." });
      return;
    }

    if (contact_by_conversation.messages.length === 0) {
      res.status(200).json({ data: "No messages available to summarize." });
      return;
    }
    const textSummarized = await summarize_conversation_by_id(
      contact_by_conversation,
    );

    console.log(textSummarized);

    res.status(200).json({ data: textSummarized });
  } catch (error) {
    console.error("Error summarizing conversation:", error);
    res.status(500).json({ message: "Failed to summarize conversation." });
  }
};

export const addMessageToConversation = async (req: Request, res: Response) => {
  const uuid = randomUUID();
  const { conversation_id } = req.params;
  const { senderId, content } = req.body;

  if (!content || !senderId) {
    res.status(400).json({ message: "Sender ID and content are required." });
    return;
  }

  try {
    const new_message = await MyMessageModel.create({
      content: content,
      sender_id: senderId,
    });

    const targetContact = await MyContactModel.findOne({
      conversation_id: conversation_id,
      owner: user_id,
    });

    if (targetContact) {
      targetContact.messages.push(new_message);
      await targetContact.save();
      console.log(targetContact);

      res
        .status(200)
        .json({ message: "success message added", data: targetContact });
    } else {
      res.status(404).json({ message: "Conversation or contact not found." });
    }
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Failed to add message to conversation." });
  }
};
