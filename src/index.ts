import express from "express";
import cors from "cors";
import { indexMenu, menuQAFlow } from "./genkit/main";
import { expressHandler } from "@genkit-ai/express";

const app = express();

app.use(cors());
app.use(express.json());
app.post("/ferinfo", expressHandler(menuQAFlow));

app.listen(8080, () => {
  console.log("Express server listening on http://localhost:8080");
});
