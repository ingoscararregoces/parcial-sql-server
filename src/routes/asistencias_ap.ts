import { Router } from "express";
import { createAsistencia, deleteAsistencia, deleteAsistencias, findAsistencia, findAsistencias, updateAsistencia } from "../controllers/asistencia_ap.controller";

const router = Router();

router.get('/', findAsistencias);
router.get('/:id',findAsistencia);
router.post('/', createAsistencia);
router.patch('/:id', updateAsistencia);
router.delete('/:id', deleteAsistencia);
router.delete('/', deleteAsistencias);

export { router };