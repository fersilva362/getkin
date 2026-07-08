import express from "express";
import cors from "cors";
import { menuQAFlow } from "./genkit/main";
import { expressHandler } from "@genkit-ai/express";
import contact_router from "./routes/contact_routes";
import conversation_route from "./routes/conversations_routes";

const app = express();

app.use(cors());
app.use(express.json());
app.post("/ferinfo", expressHandler(menuQAFlow));
app.use("/", contact_router);
app.use("/", conversation_route);

app.listen(8080, () => {
  console.log("Express server listening on http://localhost:8080");
});
