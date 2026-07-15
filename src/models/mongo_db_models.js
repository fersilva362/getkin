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

export const userDbSchema = new mongooseSchema({
  contact_email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
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
export const MyUserModel = mongoose.model("userDbSchema", userDbSchema);
