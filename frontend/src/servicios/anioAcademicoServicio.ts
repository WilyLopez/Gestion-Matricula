// src/servicios/anioAcademicoServicio.ts
import api from "./api";
import { RespuestaApi, AnioAcademico } from "@/tipos";

export const anioAcademicoServicio = {
    async obtenerTodos(): Promise<AnioAcademico[]> {
        const respuesta = await api.get<RespuestaApi<AnioAcademico[]>>(
            "/anios-academicos"
        );
        return respuesta.data.datos || [];
    },

    async obtenerActivo(): Promise<AnioAcademico> {
        const respuesta = await api.get<RespuestaApi<AnioAcademico>>(
            "/anios-academicos/activo"
        );
        return respuesta.data.datos as AnioAcademico;
    },

    async obtenerPorId(id: number): Promise<AnioAcademico> {
        const respuesta = await api.get<RespuestaApi<AnioAcademico>>(
            `/anios-academicos/${id}`
        );
        return respuesta.data.datos as AnioAcademico;
    },

    async crear(datos: {
        anio: number;
        esActivo: boolean;
    }): Promise<AnioAcademico> {
        const respuesta = await api.post<RespuestaApi<AnioAcademico>>(
            "/anios-academicos",
            datos
        );
        return respuesta.data.datos as AnioAcademico;
    },

    async actualizar(
        id: number,
        datos: Partial<{ anio: number; esActivo: boolean }>
    ): Promise<AnioAcademico> {
        const respuesta = await api.put<RespuestaApi<AnioAcademico>>(
            `/anios-academicos/${id}`,
            datos
        );
        return respuesta.data.datos as AnioAcademico;
    },

    async activar(id: number): Promise<AnioAcademico> {
        const respuesta = await api.put<RespuestaApi<AnioAcademico>>(
            `/anios-academicos/${id}/activar`
        );
        return respuesta.data.datos as AnioAcademico;
    },

    async eliminar(id: number): Promise<void> {
        await api.delete(`/anios-academicos/${id}`);
    },
};
