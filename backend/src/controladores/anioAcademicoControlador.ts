// src/controladores/anioAcademicoControlador.ts
import { Request, Response } from "express";
import { AnioAcademicoServicio } from "../services/anioAcademicoServicio";
import {
    enviarRespuestaExito,
    enviarRespuestaError,
} from "../utils/respuesta";

export class AnioAcademicoControlador {
    private anioAcademicoServicio: AnioAcademicoServicio;

    constructor() {
        this.anioAcademicoServicio = new AnioAcademicoServicio();
    }

    obtenerTodos = async (req: Request, res: Response): Promise<Response> => {
        try {
            const aniosAcademicos =
                await this.anioAcademicoServicio.obtenerTodos();
            return enviarRespuestaExito(
                res,
                aniosAcademicos,
                "Años académicos obtenidos exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener años académicos",
                error.message,
                500
            );
        }
    };

    obtenerPorId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const anioAcademico = await this.anioAcademicoServicio.obtenerPorId(
                Number(id)
            );
            return enviarRespuestaExito(
                res,
                anioAcademico,
                "Año académico obtenido exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener año académico",
                error.message,
                404
            );
        }
    };

    obtenerActivo = async (req: Request, res: Response): Promise<Response> => {
        try {
            const anioAcademico =
                await this.anioAcademicoServicio.obtenerActivo();
            return enviarRespuestaExito(
                res,
                anioAcademico,
                "Año académico activo obtenido exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener año académico activo",
                error.message,
                404
            );
        }
    };

    crear = async (req: Request, res: Response): Promise<Response> => {
        try {
            const anioAcademico = await this.anioAcademicoServicio.crear(
                req.body
            );
            return enviarRespuestaExito(
                res,
                anioAcademico,
                "Año académico creado exitosamente",
                201
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al crear año académico",
                error.message,
                400
            );
        }
    };

    actualizar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const anioAcademico = await this.anioAcademicoServicio.actualizar(
                Number(id),
                req.body
            );
            return enviarRespuestaExito(
                res,
                anioAcademico,
                "Año académico actualizado exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al actualizar año académico",
                error.message,
                400
            );
        }
    };

    activar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const anioAcademico = await this.anioAcademicoServicio.activar(
                Number(id)
            );
            return enviarRespuestaExito(
                res,
                anioAcademico,
                "Año académico activado exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al activar año académico",
                error.message,
                400
            );
        }
    };

    eliminar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const anioAcademico = await this.anioAcademicoServicio.eliminar(
                Number(id)
            );
            return enviarRespuestaExito(
                res,
                anioAcademico,
                "Año académico eliminado exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al eliminar año académico",
                error.message,
                400
            );
        }
    };
}
