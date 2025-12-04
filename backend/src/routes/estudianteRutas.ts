// src/rutas/estudianteRutas.ts
import { Router } from "express";
import { EstudianteControlador } from "../controladores/estudianteControlador";

const router = Router();
const estudianteControlador = new EstudianteControlador();

router.get("/", estudianteControlador.obtenerTodos);
router.get("/:id", estudianteControlador.obtenerPorId);
router.post("/", estudianteControlador.crear);
router.put("/:id", estudianteControlador.actualizar);
router.delete("/:id", estudianteControlador.eliminar);

export default router;
