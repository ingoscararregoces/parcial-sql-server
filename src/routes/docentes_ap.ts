import { Router } from "express";
import { createDocente, deleteDocente, deleteDocentes, findDocente, findDocentes, updateDocente } from "../controllers/docentes_ap.controller";

const router = Router();

router.get("/", findDocentes);
router.get("/:id", findDocente);
router.post("/", createDocente);
router.patch("/:id", updateDocente);
router.delete("/:id", deleteDocente);
router.delete("/", deleteDocentes);

export { router };
