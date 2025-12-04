// src/aplicacion.ts
import express, { Application } from "express";
import cors from "cors";
import rutas from "./routes";
import {
    manejadorErrores,
    rutaNoEncontrada,
} from "./middlewares/manejadorErrores";

export const crearAplicacion = (): Application => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/api", rutas);

    app.use(rutaNoEncontrada);
    app.use(manejadorErrores);

    return app;
};
