// src/servicios/estudianteServicio.ts
import api from "./api";
import { RespuestaApi, Estudiante, EstudianteFormulario } from "@/tipos";

export const estudianteServicio = {
    async obtenerTodos(): Promise<Estudiante[]> {
        const respuesta = await api.get<RespuestaApi<Estudiante[]>>(
            "/estudiantes"
        );
        return respuesta.data.datos || [];
    },

    async obtenerPorId(id: number): Promise<Estudiante> {
        const respuesta = await api.get<RespuestaApi<Estudiante>>(
            `/estudiantes/${id}`
        );
        return respuesta.data.datos as Estudiante;
    },

    async buscar(termino: string): Promise<Estudiante[]> {
        const respuesta = await api.get<RespuestaApi<Estudiante[]>>(
            "/estudiantes/buscar",
            {
                params: { q: termino },
            }
        );
        return respuesta.data.datos || [];
    },

    async crear(datos: EstudianteFormulario): Promise<Estudiante> {
        const respuesta = await api.post<RespuestaApi<Estudiante>>(
            "/estudiantes",
            datos
        );
        return respuesta.data.datos as Estudiante;
    },

    async actualizar(
        id: number,
        datos: Partial<EstudianteFormulario>
    ): Promise<Estudiante> {
        const respuesta = await api.put<RespuestaApi<Estudiante>>(
            `/estudiantes/${id}`,
            datos
        );
        return respuesta.data.datos as Estudiante;
    },

    async eliminar(id: number): Promise<void> {
        await api.delete(`/estudiantes/${id}`);
    },
};
