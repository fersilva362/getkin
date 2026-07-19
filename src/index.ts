import express from "express";
import cors from "cors";
import { menuQAFlow } from "./genkit/main.js";
import { expressHandler } from "@genkit-ai/express";
import contact_router from "./routes/contact_routes.js";
import conversation_route from "./routes/conversations_routes.js";
import { summarizer_route } from "./routes/summarize_routes.js";
import { db_connection } from "./config/db_connection.js";
import { auth_route } from "./routes/auth_routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.post("/ferinfo", expressHandler(menuQAFlow));
app.use("/", contact_router);
app.use("/", conversation_route);
app.use("/", summarizer_route);
app.use("/", auth_route);
app.get("/", (req, res) => {
  console.log("welcome");
  res.send("Welcome!");
});
db_connection();
app.listen(8080, () => {
  console.log("Express server listening on http://localhost:8080");
});
