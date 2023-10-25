import { Router } from "express";
import { createLinea, deleteLinea, deleteLineas, findLinea, findLineas, updateLinea } from "../controllers/lineas_apitre.controller";

const router = Router();

router.get("/", findLineas);
router.get("/:id", findLinea);
router.post("/", createLinea);
router.patch("/:id", updateLinea);
router.delete("/:id", deleteLinea);
router.delete("/", deleteLineas);

export { router };
