// src/controladores/estudianteControlador.ts
import { Request, Response } from "express";
import { EstudianteServicio } from "../services/estudianteServicio";
import {
    enviarRespuestaExito,
    enviarRespuestaError,
} from "../utils/respuesta";

export class EstudianteControlador {
    private estudianteServicio: EstudianteServicio;

    constructor() {
        this.estudianteServicio = new EstudianteServicio();
    }

    obtenerTodos = async (req: Request, res: Response): Promise<Response> => {
        try {
            const {
                pagina = 1,
                limite = 10,
                busqueda = '',
                estado,
            } = req.query;

            const opciones = {
                pagina: Number(pagina),
                limite: Number(limite),
                busqueda: String(busqueda),
                estado: estado as any,
            };

            const estudiantes = await this.estudianteServicio.obtenerTodos(opciones);
            return enviarRespuestaExito(
                res,
                estudiantes,
                "Estudiantes obtenidos exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener estudiantes",
                error.message,
                500
            );
        }
    };

    obtenerPorId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const estudiante = await this.estudianteServicio.obtenerPorId(
                Number(id)
            );
            return enviarRespuestaExito(
                res,
                estudiante,
                "Estudiante obtenido exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener estudiante",
                error.message,
                404
            );
        }
    };

    crear = async (req: Request, res: Response): Promise<Response> => {
        try {
            const estudiante = await this.estudianteServicio.crear(req.body);
            return enviarRespuestaExito(
                res,
                estudiante,
                "Estudiante creado exitosamente",
                201
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al crear estudiante",
                error.message,
                400
            );
        }
    };

    actualizar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const estudiante = await this.estudianteServicio.actualizar(
                Number(id),
                req.body
            );
            return enviarRespuestaExito(
                res,
                estudiante,
                "Estudiante actualizado exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al actualizar estudiante",
                error.message,
                400
            );
        }
    };

    eliminar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const estudiante = await this.estudianteServicio.eliminar(
                Number(id)
            );
            return enviarRespuestaExito(
                res,
                estudiante,
                "Estudiante eliminado exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al eliminar estudiante",
                error.message,
                400
            );
        }
    };
}
