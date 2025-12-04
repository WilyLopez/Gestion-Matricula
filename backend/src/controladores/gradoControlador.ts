// src/controladores/gradoControlador.ts
import { Request, Response } from "express";
import { GradoServicio } from "../services/gradoServicio";
import {
    enviarRespuestaExito,
    enviarRespuestaError,
} from "../utils/respuesta";

export class GradoControlador {
    private gradoServicio: GradoServicio;

    constructor() {
        this.gradoServicio = new GradoServicio();
    }

    obtenerTodos = async (req: Request, res: Response): Promise<Response> => {
        try {
            const grados = await this.gradoServicio.obtenerTodos();
            return enviarRespuestaExito(
                res,
                grados,
                "Grados obtenidos exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener grados",
                error.message,
                500
            );
        }
    };

    obtenerPorNivel = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const { nivelId } = req.params;
            const grados = await this.gradoServicio.obtenerPorNivel(
                Number(nivelId)
            );
            return enviarRespuestaExito(
                res,
                grados,
                "Grados obtenidos exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener grados",
                error.message,
                404
            );
        }
    };

    obtenerPorId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const grado = await this.gradoServicio.obtenerPorId(Number(id));
            return enviarRespuestaExito(
                res,
                grado,
                "Grado obtenido exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener grado",
                error.message,
                404
            );
        }
    };

    crear = async (req: Request, res: Response): Promise<Response> => {
        try {
            const grado = await this.gradoServicio.crear(req.body);
            return enviarRespuestaExito(
                res,
                grado,
                "Grado creado exitosamente",
                201
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al crear grado",
                error.message,
                400
            );
        }
    };

    actualizar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const grado = await this.gradoServicio.actualizar(
                Number(id),
                req.body
            );
            return enviarRespuestaExito(
                res,
                grado,
                "Grado actualizado exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al actualizar grado",
                error.message,
                400
            );
        }
    };

    eliminar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const grado = await this.gradoServicio.eliminar(Number(id));
            return enviarRespuestaExito(
                res,
                grado,
                "Grado eliminado exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al eliminar grado",
                error.message,
                400
            );
        }
    };
}
