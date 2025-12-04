// src/controladores/matriculaControlador.ts
import { Request, Response } from "express";
import { MatriculaServicio } from "../services/matriculaServicio";
import {
    enviarRespuestaExito,
    enviarRespuestaError,
} from "../utils/respuesta";

export class MatriculaControlador {
    private matriculaServicio: MatriculaServicio;

    constructor() {
        this.matriculaServicio = new MatriculaServicio();
    }

    obtenerTodas = async (req: Request, res: Response): Promise<Response> => {
        try {
            const matriculas = await this.matriculaServicio.obtenerTodas();
            return enviarRespuestaExito(
                res,
                matriculas,
                "Matrículas obtenidas exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener matrículas",
                error.message,
                500
            );
        }
    };

    obtenerPorId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const matricula = await this.matriculaServicio.obtenerPorId(
                Number(id)
            );
            return enviarRespuestaExito(
                res,
                matricula,
                "Matrícula obtenida exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener matrícula",
                error.message,
                404
            );
        }
    };

    obtenerPorEstudiante = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const { estudianteId } = req.params;
            const matriculas =
                await this.matriculaServicio.obtenerPorEstudiante(
                    Number(estudianteId)
                );
            return enviarRespuestaExito(
                res,
                matriculas,
                "Matrículas obtenidas exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener matrículas",
                error.message,
                404
            );
        }
    };

    obtenerPorSeccion = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const { seccionId } = req.params;
            const matriculas = await this.matriculaServicio.obtenerPorSeccion(
                Number(seccionId)
            );
            return enviarRespuestaExito(
                res,
                matriculas,
                "Matrículas obtenidas exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener matrículas",
                error.message,
                404
            );
        }
    };

    crear = async (req: Request, res: Response): Promise<Response> => {
        try {
            const matricula = await this.matriculaServicio.crear(req.body);
            return enviarRespuestaExito(
                res,
                matricula,
                "Matrícula creada exitosamente",
                201
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al crear matrícula",
                error.message,
                400
            );
        }
    };

    actualizarEstado = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            const matricula = await this.matriculaServicio.actualizarEstado(
                Number(id),
                estado
            );
            return enviarRespuestaExito(
                res,
                matricula,
                "Estado de matrícula actualizado exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al actualizar estado",
                error.message,
                400
            );
        }
    };

    eliminar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const matricula = await this.matriculaServicio.eliminar(Number(id));
            return enviarRespuestaExito(
                res,
                matricula,
                "Matrícula eliminada exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al eliminar matrícula",
                error.message,
                400
            );
        }
    };
}
