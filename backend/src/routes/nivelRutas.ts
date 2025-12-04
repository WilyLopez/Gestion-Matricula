// src/rutas/nivelRutas.ts
import { Router } from "express";
import { NivelControlador } from "../controladores/nivelControlador";

const router = Router();
const nivelControlador = new NivelControlador();

router.get("/", nivelControlador.obtenerTodos);
router.get("/:id", nivelControlador.obtenerPorId);
router.post("/", nivelControlador.crear);
router.put("/:id", nivelControlador.actualizar);
router.delete("/:id", nivelControlador.eliminar);

export default router;
