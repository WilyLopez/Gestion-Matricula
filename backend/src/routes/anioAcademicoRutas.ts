// src/rutas/anioAcademicoRutas.ts
import { Router } from "express";
import { AnioAcademicoControlador } from "../controladores/anioAcademicoControlador";

const router = Router();
const anioAcademicoControlador = new AnioAcademicoControlador();

router.get("/", anioAcademicoControlador.obtenerTodos);
router.get("/activo", anioAcademicoControlador.obtenerActivo);
router.get("/:id", anioAcademicoControlador.obtenerPorId);
router.post("/", anioAcademicoControlador.crear);
router.put("/:id", anioAcademicoControlador.actualizar);
router.put("/:id/activar", anioAcademicoControlador.activar);
router.delete("/:id", anioAcademicoControlador.eliminar);

export default router;
