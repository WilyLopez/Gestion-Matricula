// src/servicios/matriculaServicio.ts
import api from "./api";
import { RespuestaApi, Matricula, MatriculaFormulario } from "@/tipos";

export const matriculaServicio = {
    async obtenerTodas(): Promise<Matricula[]> {
        const respuesta = await api.get<RespuestaApi<Matricula[]>>(
            "/matriculas"
        );
        return respuesta.data.datos || [];
    },

    async obtenerPorId(id: number): Promise<Matricula> {
        const respuesta = await api.get<RespuestaApi<Matricula>>(
            `/matriculas/${id}`
        );
        return respuesta.data.datos as Matricula;
    },

    async obtenerPorEstudiante(estudianteId: number): Promise<Matricula[]> {
        const respuesta = await api.get<RespuestaApi<Matricula[]>>(
            `/matriculas/estudiante/${estudianteId}`
        );
        return respuesta.data.datos || [];
    },

    async obtenerPorSeccion(seccionId: number): Promise<Matricula[]> {
        const respuesta = await api.get<RespuestaApi<Matricula[]>>(
            `/matriculas/seccion/${seccionId}`
        );
        return respuesta.data.datos || [];
    },

    async crear(datos: MatriculaFormulario): Promise<Matricula> {
        const respuesta = await api.post<RespuestaApi<Matricula>>(
            "/matriculas",
            datos
        );
        return respuesta.data.datos as Matricula;
    },

    async actualizarEstado(id: number, estado: string): Promise<Matricula> {
        const respuesta = await api.put<RespuestaApi<Matricula>>(
            `/matriculas/${id}/estado`,
            { estado }
        );
        return respuesta.data.datos as Matricula;
    },

    async eliminar(id: number): Promise<void> {
        await api.delete(`/matriculas/${id}`);
    },
};
