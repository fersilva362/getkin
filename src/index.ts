import express from "express";
import cors from "cors";
import { menuQAFlow } from "./genkit/main";
import { expressHandler } from "@genkit-ai/express";
import contact_router from "./routes/contact_routes";
import conversation_route from "./routes/conversations_routes";
import { summarizer_route } from "./routes/summarize_routes";
import { db_connection } from "./config/db_connection";
import { auth_route } from "./routes/auth_routes";

const app = express();

app.use(cors());
app.use(express.json());
app.post("/ferinfo", expressHandler(menuQAFlow));
app.use("/", contact_router);
app.use("/", conversation_route);
app.use("/", summarizer_route);
app.use("/", auth_route);

db_connection();
app.listen(8080, () => {
  console.log("Express server listening on http://localhost:8080");
});
