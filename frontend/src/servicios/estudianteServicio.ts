// src/servicios/estudianteServicio.ts
import api from "./api";
import { RespuestaApi, Estudiante, EstudianteFormulario, Paginated } from "@/tipos";

type OpcionesFiltro = {
    pagina?: number;
    limite?: number;
    busqueda?: string;
    estado?: "matriculado" | "sin-matricula" | "";
};

export const estudianteServicio = {
    async obtenerTodos(opciones: OpcionesFiltro = {}): Promise<Paginated<Estudiante>> {
        const { pagina = 1, limite = 10, busqueda, estado } = opciones;

        const params = new URLSearchParams();
        params.append("pagina", String(pagina));
        params.append("limite", String(limite));
        if (busqueda) {
            params.append("busqueda", busqueda);
        }
        if (estado) {
            params.append("estado", estado);
        }

        const respuesta = await api.get<RespuestaApi<Paginated<Estudiante>>>(
            `/estudiantes?${params.toString()}`
        );
        return respuesta.data.datos || { registros: [], total: 0 };
    },

    async obtenerPorId(id: number): Promise<Estudiante> {
        const respuesta = await api.get<RespuestaApi<Estudiante>>(
            `/estudiantes/${id}`
        );
        return respuesta.data.datos as Estudiante;
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
