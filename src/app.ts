import express, { Router, urlencoded } from "express";
import "dotenv/config";
import cors from "cors";
import { router } from "./routes";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(router);

app.listen(PORT, () => console.log(`Corriendo en el puerto: ${PORT}`));
