import mongoose from "mongoose";
import { type } from "node:os";

const mongooseSchema = mongoose.Schema;

const MessageSchema = mongooseSchema({
  content: { type: String },
  sender_id: { type: String, required: true },
  created_at: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
});

export const ContactSchema = new mongooseSchema({
  conversation_id: { type: String, required: true, unique: true },
  contact_email: { type: String, required: true, unique: true },
  participant_name: { type: String, required: true },
  last_message: { type: String, required: true, default: " Not messages yet" },
  last_message_time: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  messages: { type: [MessageSchema], require: true, default: [] },
});

export const MyContactModel = mongoose.model("ContactSchema", ContactSchema);
export const MyMessageModel = mongoose.model("MessageSchema", MessageSchema);

/* 
{
    conversation_id: "8b5e6814-f6be-4868-9a3f-51f75b90fb75",
    contact_email: "pepe1@",
    participant_name: "mariela",
    last_message: "male",
    last_message_time: "2026-01-19T15:59:23.863Z",
    messages: [
      {
        id: "unique-msg-id-001",
        content: "hola mariela",
        sender_id: "96",
        created_at: "2026-01-19T15:50:00.000Z",
      },
      {
        id: "unique-msg-id-002",
        content: "male",
        sender_id: "102",
        created_at: "2026-01-19T15:59:23.863Z",
      },
    ],
  }, */
