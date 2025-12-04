// src/rutas/profesorRutas.ts
import { Router } from "express";
import { ProfesorControlador } from "../controladores/profesorControlador";

const router = Router();
const profesorControlador = new ProfesorControlador();

router.get("/", profesorControlador.obtenerTodos);
router.get("/buscar", profesorControlador.buscar);
router.get("/:id", profesorControlador.obtenerPorId);
router.post("/", profesorControlador.crear);
router.put("/:id", profesorControlador.actualizar);
router.delete("/:id", profesorControlador.eliminar);

export default router;
