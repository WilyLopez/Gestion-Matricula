// src/controladores/seccionControlador.ts
import { Request, Response } from "express";
import { SeccionServicio } from "../services/seccionServicio";
import {
    enviarRespuestaExito,
    enviarRespuestaError,
} from "../utils/respuesta";

export class SeccionControlador {
    private seccionServicio: SeccionServicio;

    constructor() {
        this.seccionServicio = new SeccionServicio();
    }

    obtenerTodas = async (req: Request, res: Response): Promise<Response> => {
        try {
            const secciones = await this.seccionServicio.obtenerTodas();
            return enviarRespuestaExito(
                res,
                secciones,
                "Secciones obtenidas exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener secciones",
                error.message,
                500
            );
        }
    };

    obtenerPorId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const seccion = await this.seccionServicio.obtenerPorId(Number(id));
            return enviarRespuestaExito(
                res,
                seccion,
                "Sección obtenida exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener sección",
                error.message,
                404
            );
        }
    };

    obtenerPorGrado = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const { gradoId } = req.params;
            const secciones = await this.seccionServicio.obtenerPorGrado(
                Number(gradoId)
            );
            return enviarRespuestaExito(
                res,
                secciones,
                "Secciones obtenidas exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener secciones",
                error.message,
                404
            );
        }
    };

    obtenerConVacantes = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const secciones = await this.seccionServicio.obtenerConVacantes();
            return enviarRespuestaExito(
                res,
                secciones,
                "Secciones con vacantes obtenidas exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener secciones",
                error.message,
                500
            );
        }
    };

    crear = async (req: Request, res: Response): Promise<Response> => {
        try {
            const seccion = await this.seccionServicio.crear(req.body);
            return enviarRespuestaExito(
                res,
                seccion,
                "Sección creada exitosamente",
                201
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al crear sección",
                error.message,
                400
            );
        }
    };

    actualizar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const seccion = await this.seccionServicio.actualizar(
                Number(id),
                req.body
            );
            return enviarRespuestaExito(
                res,
                seccion,
                "Sección actualizada exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al actualizar sección",
                error.message,
                400
            );
        }
    };

    eliminar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const seccion = await this.seccionServicio.eliminar(Number(id));
            return enviarRespuestaExito(
                res,
                seccion,
                "Sección eliminada exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al eliminar sección",
                error.message,
                400
            );
        }
    };
}
