// src/servicios/panelServicio.ts
import api from "./api";
import { RespuestaApi, EstadisticasPanel } from "@/tipos";

export const panelServicio = {
    async obtenerEstadisticas(): Promise<EstadisticasPanel> {
        const respuesta = await api.get<RespuestaApi<EstadisticasPanel>>(
            "/panel/estadisticas"
        );
        return respuesta.data.datos as EstadisticasPanel;
    },
};
