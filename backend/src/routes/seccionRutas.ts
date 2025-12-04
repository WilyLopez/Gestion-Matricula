// src/rutas/seccionRutas.ts
import { Router } from "express";
import { SeccionControlador } from "../controladores/seccionControlador";

const router = Router();
const seccionControlador = new SeccionControlador();

router.get("/", seccionControlador.obtenerTodas);
router.get("/vacantes", seccionControlador.obtenerConVacantes);
router.get("/grado/:gradoId", seccionControlador.obtenerPorGrado);
router.get("/:id", seccionControlador.obtenerPorId);
router.post("/", seccionControlador.crear);
router.put("/:id", seccionControlador.actualizar);
router.delete("/:id", seccionControlador.eliminar);

export default router;
