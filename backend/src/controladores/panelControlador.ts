// src/controladores/panelControlador.ts
import { Request, Response } from "express";
import { PanelServicio } from "../services/panelServicio";
import {
    enviarRespuestaExito,
    enviarRespuestaError,
} from "../utils/respuesta";

export class PanelControlador {
    private panelServicio: PanelServicio;

    constructor() {
        this.panelServicio = new PanelServicio();
    }

    obtenerEstadisticas = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        try {
            const estadisticas = await this.panelServicio.obtenerEstadisticas();
            return enviarRespuestaExito(
                res,
                estadisticas,
                "Estadísticas obtenidas exitosamente"
            );
        } catch (error: any) {
            return enviarRespuestaError(
                res,
                "Error al obtener estadísticas",
                error.message,
                500
            );
        }
    };
}
