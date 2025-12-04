// src/servicios/profesorServicio.ts
import api from "./api";
import { RespuestaApi, Profesor, ProfesorFormulario } from "@/tipos";

export const profesorServicio = {
    async obtenerTodos(): Promise<Profesor[]> {
        const respuesta = await api.get<RespuestaApi<Profesor[]>>(
            "/profesores"
        );
        return respuesta.data.datos || [];
    },

    async obtenerPorId(id: number): Promise<Profesor> {
        const respuesta = await api.get<RespuestaApi<Profesor>>(
            `/profesores/${id}`
        );
        return respuesta.data.datos as Profesor;
    },

    async buscar(termino: string): Promise<Profesor[]> {
        const respuesta = await api.get<RespuestaApi<Profesor[]>>(
            "/profesores/buscar",
            {
                params: { q: termino },
            }
        );
        return respuesta.data.datos || [];
    },

    async crear(datos: ProfesorFormulario): Promise<Profesor> {
        const respuesta = await api.post<RespuestaApi<Profesor>>(
            "/profesores",
            datos
        );
        return respuesta.data.datos as Profesor;
    },

    async actualizar(
        id: number,
        datos: Partial<ProfesorFormulario>
    ): Promise<Profesor> {
        const respuesta = await api.put<RespuestaApi<Profesor>>(
            `/profesores/${id}`,
            datos
        );
        return respuesta.data.datos as Profesor;
    },

    async eliminar(id: number): Promise<void> {
        await api.delete(`/profesores/${id}`);
    },
};
