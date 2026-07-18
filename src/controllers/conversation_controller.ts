import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { summarize_conversation_by_id } from "../genkit/summarize_conversations";
import { MyContactModel, MyMessageModel } from "../models/mongo_db_models";
import { AuthenticatedRequest } from "../middleware/express_authorization";

//const user_id = "6a56b5b4fd0d20e3de9fc433";

export const fetchConversationByUserId = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { conversation_id } = req.params;
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const { id: user_id } = req.user;

  try {
    const contact_by_conversation = await MyContactModel.findOne({
      conversation_id: conversation_id,
      owner: user_id,
    });

    if (!contact_by_conversation) {
      res.status(404).json({ message: "Conversation not found." });
      return;
    }
    const messages_retrieved = contact_by_conversation.messages;
    res.status(200).json({ data: messages_retrieved });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Failure to fetch conversation." });
  }
};

export const summarizeConversation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const { id: user_id } = req.user;
  const { conversation_id } = req.params;
  console.log(conversation_id + "<<<conversation  id>>>" + user_id);
  if (!conversation_id) {
    res.status(400).json({ message: "Conversation ID is required." });
    return;
  }
  try {
    const contact_by_conversation = await MyContactModel.findOne({
      conversation_id: conversation_id,
      owner: user_id,
    });
    if (!contact_by_conversation) {
      res.status(400).json({ message: "Conversation ID is invalid." });
      return;
    }

    if (contact_by_conversation.messages.length === 0) {
      res.status(200).json({ data: "No messages available to summarize." });
      return;
    }

    const { owner, participant_name, messages } = contact_by_conversation;

    const summarize_this_conversation = {
      owner,
      participant_name,
      messages: messages.map(
        (message: { content: string; sender_id: string }) => ({
          content: message.content,
          sender_id: message.sender_id,
        }),
      ),
    };

    const textSummarized = await summarize_conversation_by_id(
      summarize_this_conversation,
    );

    console.log(textSummarized);

    res.status(200).json({ data: textSummarized });
  } catch (error) {
    console.error("Error summarizing conversation:", error);
    res.status(500).json({ message: "Failed to summarize conversation." });
  }
};

export const addMessageToConversation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized user." });
    return;
  }

  const { id: user_id } = req.user;
  const { conversation_id } = req.params;
  const { senderId, content } = req.body;

  if (!content || !senderId) {
    res.status(400).json({ message: "Sender ID and content are required." });
    return;
  }

  try {
    const targetContact = await MyContactModel.findOne({
      conversation_id: conversation_id,
      owner: user_id,
    });

    console.log(targetContact);

    if (targetContact) {
      const new_message = await MyMessageModel.create({
        content: content,
        sender_id: senderId,
      });

      targetContact.messages.push(new_message);
      await targetContact.save();
      console.log(targetContact);

      res.status(200).json({
        message: "Message successfully added to conversation.",
        data: targetContact,
      });
    } else {
      res.status(404).json({ message: "Conversation or contact not found." });
    }
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Failed to add message to conversation." });
  }
};
