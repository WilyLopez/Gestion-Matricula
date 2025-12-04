// src/rutas/panelRutas.ts
import { Router } from "express";
import { PanelControlador } from "../controladores/panelControlador";

const router = Router();
const panelControlador = new PanelControlador();

router.get("/estadisticas", panelControlador.obtenerEstadisticas);

export default router;
