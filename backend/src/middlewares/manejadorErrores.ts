// src/middlewares/manejadorErrores.ts
import { Request, Response, NextFunction } from "express";
import { enviarRespuestaError } from "../utils/respuesta";

export const manejadorErrores = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    console.error("Error capturado:", error);

    return enviarRespuestaError(
        res,
        "Error interno del servidor",
        error.message,
        500
    );
};

export const rutaNoEncontrada = (req: Request, res: Response): Response => {
    return enviarRespuestaError(
        res,
        "Ruta no encontrada",
        `No se encontró la ruta: ${req.originalUrl}`,
        404
    );
};
