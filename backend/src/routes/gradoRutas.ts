// src/rutas/gradoRutas.ts
import { Router } from "express";
import { GradoControlador } from "../controladores/gradoControlador";

const router = Router();
const gradoControlador = new GradoControlador();

router.get("/", gradoControlador.obtenerTodos);
router.get("/nivel/:nivelId", gradoControlador.obtenerPorNivel);
router.get("/:id", gradoControlador.obtenerPorId);
router.post("/", gradoControlador.crear);
router.put("/:id", gradoControlador.actualizar);
router.delete("/:id", gradoControlador.eliminar);

export default router;
