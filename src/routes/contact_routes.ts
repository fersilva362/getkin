import { Router } from "express";
import {
  addContact,
  fetchContacts,
} from "../controllers/contact_controller.ts";

const contact_router = Router();

contact_router.get("/contacts", fetchContacts);
contact_router.post("/contacts", addContact);
export default contact_router;
