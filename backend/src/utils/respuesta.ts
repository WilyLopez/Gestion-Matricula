// src/utilidades/respuesta.ts
import { Response } from "express";
import { RespuestaApi } from "../types";

export const enviarRespuestaExito = <T>(
    res: Response,
    datos: T,
    mensaje: string = "Operación exitosa",
    codigoEstado: number = 200
): Response => {
    const respuesta: RespuestaApi<T> = {
        exito: true,
        mensaje,
        datos,
    };
    return res.status(codigoEstado).json(respuesta);
};

export const enviarRespuestaError = (
    res: Response,
    mensaje: string = "Error en la operación",
    error?: string,
    codigoEstado: number = 400
): Response => {
    const respuesta: RespuestaApi = {
        exito: false,
        mensaje,
        error,
    };
    return res.status(codigoEstado).json(respuesta);
};
