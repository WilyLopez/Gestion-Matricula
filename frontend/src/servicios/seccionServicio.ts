// src/servicios/seccionServicio.ts
import api from "./api";
import { RespuestaApi, Seccion, SeccionFormulario } from "@/tipos";

export const seccionServicio = {
    async obtenerTodas(): Promise<Seccion[]> {
        const respuesta = await api.get<RespuestaApi<Seccion[]>>("/secciones");
        return respuesta.data.datos || [];
    },

    async obtenerPorId(id: number): Promise<Seccion> {
        const respuesta = await api.get<RespuestaApi<Seccion>>(
            `/secciones/${id}`
        );
        return respuesta.data.datos as Seccion;
    },

    async obtenerPorGrado(gradoId: number): Promise<Seccion[]> {
        const respuesta = await api.get<RespuestaApi<Seccion[]>>(
            `/secciones/grado/${gradoId}`
        );
        return respuesta.data.datos || [];
    },

    async obtenerConVacantes(): Promise<Seccion[]> {
        const respuesta = await api.get<RespuestaApi<Seccion[]>>(
            "/secciones/vacantes"
        );
        return respuesta.data.datos || [];
    },

    async crear(datos: SeccionFormulario): Promise<Seccion> {
        const respuesta = await api.post<RespuestaApi<Seccion>>(
            "/secciones",
            datos
        );
        return respuesta.data.datos as Seccion;
    },

    async actualizar(
        id: number,
        datos: Partial<SeccionFormulario>
    ): Promise<Seccion> {
        const respuesta = await api.put<RespuestaApi<Seccion>>(
            `/secciones/${id}`,
            datos
        );
        return respuesta.data.datos as Seccion;
    },

    async eliminar(id: number): Promise<void> {
        await api.delete(`/secciones/${id}`);
    },
};
