// src/rutas/matriculaRutas.ts
import { Router } from "express";
import { MatriculaControlador } from "../controladores/matriculaControlador";

const router = Router();
const matriculaControlador = new MatriculaControlador();

router.get("/", matriculaControlador.obtenerTodas);
router.get(
    "/estudiante/:estudianteId",
    matriculaControlador.obtenerPorEstudiante
);
router.get("/seccion/:seccionId", matriculaControlador.obtenerPorSeccion);
router.get("/:id", matriculaControlador.obtenerPorId);
router.post("/", matriculaControlador.crear);
router.put("/:id/estado", matriculaControlador.actualizarEstado);
router.delete("/:id", matriculaControlador.eliminar);

export default router;
