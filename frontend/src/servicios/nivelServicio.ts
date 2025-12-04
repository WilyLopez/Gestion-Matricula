// src/servicios/nivelServicio.ts
import api from "./api";
import { RespuestaApi, Nivel } from "@/tipos";

export const nivelServicio = {
    async obtenerTodos(): Promise<Nivel[]> {
        const respuesta = await api.get<RespuestaApi<Nivel[]>>("/niveles");
        return respuesta.data.datos || [];
    },

    async obtenerPorId(id: number): Promise<Nivel> {
        const respuesta = await api.get<RespuestaApi<Nivel>>(`/niveles/${id}`);
        return respuesta.data.datos as Nivel;
    },

    async crear(datos: { nombre: string }): Promise<Nivel> {
        const respuesta = await api.post<RespuestaApi<Nivel>>(
            "/niveles",
            datos
        );
        return respuesta.data.datos as Nivel;
    },

    async actualizar(id: number, datos: { nombre: string }): Promise<Nivel> {
        const respuesta = await api.put<RespuestaApi<Nivel>>(
            `/niveles/${id}`,
            datos
        );
        return respuesta.data.datos as Nivel;
    },

    async eliminar(id: number): Promise<void> {
        await api.delete(`/niveles/${id}`);
    },
};
