import { Router } from "express";
import { createGrupo, deleteGrupo, deleteGrupos, findGrupo, findGrupos, updateGrupo } from "../controllers/grupos_apitre.controller";

const router = Router();

router.get('/', findGrupos);
router.get('/:id',findGrupo);
router.post('/', createGrupo);
router.patch('/:id', updateGrupo);
router.delete('/:id', deleteGrupo);
router.delete('/', deleteGrupos);

export { router };