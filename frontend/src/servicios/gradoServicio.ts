// src/servicios/gradoServicio.ts
import api from "./api";
import { RespuestaApi, Grado } from "@/tipos";

export const gradoServicio = {
    async obtenerTodos(): Promise<Grado[]> {
        const respuesta = await api.get<RespuestaApi<Grado[]>>("/grados");
        return respuesta.data.datos || [];
    },

    async obtenerPorNivel(nivelId: number): Promise<Grado[]> {
        const respuesta = await api.get<RespuestaApi<Grado[]>>(
            `/grados/nivel/${nivelId}`
        );
        return respuesta.data.datos || [];
    },

    async obtenerPorId(id: number): Promise<Grado> {
        const respuesta = await api.get<RespuestaApi<Grado>>(`/grados/${id}`);
        return respuesta.data.datos as Grado;
    },

    async crear(datos: { nivelId: number; nombre: string }): Promise<Grado> {
        const respuesta = await api.post<RespuestaApi<Grado>>("/grados", datos);
        return respuesta.data.datos as Grado;
    },

    async actualizar(
        id: number,
        datos: Partial<{ nivelId: number; nombre: string }>
    ): Promise<Grado> {
        const respuesta = await api.put<RespuestaApi<Grado>>(
            `/grados/${id}`,
            datos
        );
        return respuesta.data.datos as Grado;
    },

    async eliminar(id: number): Promise<void> {
        await api.delete(`/grados/${id}`);
    },
};
