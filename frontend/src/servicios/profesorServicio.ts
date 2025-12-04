// src/servicios/profesorServicio.ts
import api from "./api";
import { RespuestaApi, Profesor, ProfesorFormulario, Paginated } from "@/tipos";

type OpcionesFiltro = {
    pagina?: number;
    limite?: number;
    busqueda?: string;
};

export const profesorServicio = {
    async obtenerTodos(opciones: OpcionesFiltro = {}): Promise<Paginated<Profesor>> {
        const { pagina = 1, limite = 10, busqueda } = opciones;

        const params = new URLSearchParams();
        params.append("pagina", String(pagina));
        params.append("limite", String(limite));
        if (busqueda) {
            params.append("busqueda", busqueda);
        }

        const respuesta = await api.get<RespuestaApi<Paginated<Profesor>>>(
            `/profesores?${params.toString()}`
        );
        return respuesta.data.datos || { registros: [], total: 0 };
    },

    async obtenerPorId(id: number): Promise<Profesor> {
        const respuesta = await api.get<RespuestaApi<Profesor>>(
            `/profesores/${id}`
        );
        return respuesta.data.datos as Profesor;
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
