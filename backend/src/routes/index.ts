// src/rutas/index.ts
import { Router } from "express";
import nivelRutas from "./nivelRutas";
import gradoRutas from "./gradoRutas";
import profesorRutas from "./profesorRutas";
import estudianteRutas from "./estudianteRutas";
import seccionRutas from "./seccionRutas";
import anioAcademicoRutas from "./anioAcademicoRutas";
import matriculaRutas from "./matriculaRutas";
import panelRutas from "./panelRutas";

const router = Router();

router.use("/niveles", nivelRutas);
router.use("/grados", gradoRutas);
router.use("/profesores", profesorRutas);
router.use("/estudiantes", estudianteRutas);
router.use("/secciones", seccionRutas);
router.use("/anios-academicos", anioAcademicoRutas);
router.use("/matriculas", matriculaRutas);
router.use("/panel", panelRutas);

export default router;
