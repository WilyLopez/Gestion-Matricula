// src/servicios/profesorServicio.ts
import { ProfesorRepositorio } from "../repository/profesorRepositorio";
import { Profesor } from "@prisma/client";
import { ProfesorCrear, ProfesorActualizar, ProfesorConRelaciones, Paginated } from "../types";

type OpcionesFiltro = {
    pagina?: number;
    limite?: number;
    busqueda?: string;
};

export class ProfesorServicio {
    private profesorRepositorio: ProfesorRepositorio;

    constructor() {
        this.profesorRepositorio = new ProfesorRepositorio();
    }

    async obtenerTodos(opciones: OpcionesFiltro = {}): Promise<Paginated<ProfesorConRelaciones>> {
        const [registros, total] = await Promise.all([
            this.profesorRepositorio.obtenerTodos(opciones),
            this.profesorRepositorio.contarTodos(opciones)
        ]);

        return { registros, total };
    }

    async obtenerPorId(id: number): Promise<ProfesorConRelaciones> {
        const profesor = await this.profesorRepositorio.obtenerPorId(id);

        if (!profesor) {
            throw new Error("Profesor no encontrado");
        }

        return profesor;
    }

    async crear(datos: ProfesorCrear): Promise<Profesor> {
        this.validarDatosProfesor(datos);

        const profesorExistente = await this.profesorRepositorio.obtenerPorDni(
            datos.dni
        );

        if (profesorExistente) {
            throw new Error("Ya existe un profesor con ese DNI");
        }

        return await this.profesorRepositorio.crear(datos);
    }

    async actualizar(id: number, datos: ProfesorActualizar): Promise<Profesor> {
        const profesor = await this.obtenerPorId(id);

        if (datos.dni && datos.dni !== profesor.dni) {
            const profesorExistente =
                await this.profesorRepositorio.obtenerPorDni(datos.dni);

            if (profesorExistente) {
                throw new Error("Ya existe un profesor con ese DNI");
            }
        }

        return await this.profesorRepositorio.actualizar(id, datos);
    }

    async eliminar(id: number): Promise<Profesor> {
        const profesor = await this.obtenerPorId(id);

        if (profesor.secciones && profesor.secciones.length > 0) {
            throw new Error(
                "No se puede eliminar el profesor porque está asignado a una o más secciones."
            );
        }

        return await this.profesorRepositorio.eliminar(id);
    }

    private validarDatosProfesor(datos: ProfesorCrear): void {
        if (!datos.nombres || datos.nombres.trim() === "") {
            throw new Error("Los nombres son requeridos");
        }

        if (!datos.apellidos || datos.apellidos.trim() === "") {
            throw new Error("Los apellidos son requeridos");
        }

        if (!datos.dni || datos.dni.trim() === "") {
            throw new Error("El DNI es requerido");
        }

        if (!datos.especialidad || datos.especialidad.trim() === "") {
            throw new Error("La especialidad es requerida");
        }

        if (!datos.telefono || datos.telefono.trim() === "") {
            throw new Error("El teléfono es requerido");
        }

        if (!datos.email || datos.email.trim() === "") {
            throw new Error("El email es requerido");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datos.email)) {
            throw new Error("El formato del email no es válido");
        }
    }
}
