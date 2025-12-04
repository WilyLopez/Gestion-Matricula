// src/controladores/profesorControlador.ts
import { Request, Response } from "express";
import { ProfesorServicio } from "../services/profesorServicio";
import {
    enviarRespuestaExito,
    enviarRespuestaError,
} from "../utils/respuesta";

export class ProfesorControlador {
    private profesorServicio: ProfesorServicio;

    constructor() {
        this.profesorServicio = new ProfesorServicio();
    }

    obtenerTodos = async (req: Request, res: Response): Promise<Response> => {
        try {
            const {
                pagina = 1,
                limite = 10,
                busqueda = '',
            } = req.query;

            const opciones = {
                pagina: Number(pagina),
                limite: Number(limite),
                busqueda: String(busqueda),
            };

            const profesores = await this.profesorServicio.obtenerTodos(opciones);
            return enviarRespuestaExito(
                res,
                profesores,
                "Profesores obtenidos exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener profesores",
                error.message,
                500
            );
        }
    };

    obtenerPorId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const profesor = await this.profesorServicio.obtenerPorId(
                Number(id)
            );
            return enviarRespuestaExito(
                res,
                profesor,
                "Profesor obtenido exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener profesor",
                error.message,
                404
            );
        }
    };

    crear = async (req: Request, res: Response): Promise<Response> => {
        try {
            const profesor = await this.profesorServicio.crear(req.body);
            return enviarRespuestaExito(
                res,
                profesor,
                "Profesor creado exitosamente",
                201
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al crear profesor",
                error.message,
                400
            );
        }
    };

    actualizar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const profesor = await this.profesorServicio.actualizar(
                Number(id),
                req.body
            );
            return enviarRespuestaExito(
                res,
                profesor,
                "Profesor actualizado exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al actualizar profesor",
                error.message,
                400
            );
        }
    };

    eliminar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const profesor = await this.profesorServicio.eliminar(Number(id));
            return enviarRespuestaExito(
                res,
                profesor,
                "Profesor eliminado exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al eliminar profesor",
                error.message,
                400
            );
        }
    };
}
