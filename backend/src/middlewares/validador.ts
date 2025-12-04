// src/middlewares/validador.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { enviarRespuestaError } from "../utils/respuesta";

export const validarResultado = (
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        const mensajesError = errores
            .array()
            .map((error) => error.msg)
            .join(", ");
        return enviarRespuestaError(
            res,
            "Errores de validación",
            mensajesError,
            400
        );
    }

    next();
};
