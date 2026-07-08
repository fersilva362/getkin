import { Request, Response } from "express";
import { myContacts } from "../data/data_contacts";

export const fetchConversationByUserId = async (
  req: Request,
  res: Response,
) => {
  const { conversation_id } = req.params;
  console.log(conversation_id);

  try {
    const contact_by_conversation = [...myContacts].find(
      (msg) => msg.conversation_id === conversation_id,
    );

    console.log(contact_by_conversation);

    if (!contact_by_conversation) {
      res.status(400).json({ messsage: "Not found conversations" });
      return;
    }

    const conversations = contact_by_conversation.messages;
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Failure to fetch conversations" });
  }
};
