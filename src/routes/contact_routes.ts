import { Router } from "express";
import {
  addContact,
  fetchContacts,
} from "../controllers/contact_controller.ts";
import {
  auth_by_express,
  auth_verification,
} from "../middleware/express_authorization.ts";

const contact_router = Router();

contact_router.get("/contacts", auth_verification, fetchContacts);
contact_router.post("/contacts", auth_verification, addContact);
export default contact_router;
