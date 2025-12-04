// src/services/estudianteServicio.ts
import { EstudianteRepositorio } from "../repository/estudianteRepositorio";
import { Estudiante } from "@prisma/client";
import { EstudianteCrear, EstudianteActualizar } from "../types";

export class EstudianteServicio {
    private estudianteRepositorio: EstudianteRepositorio;

    constructor() {
        this.estudianteRepositorio = new EstudianteRepositorio();
    }

    async obtenerTodos(): Promise<Estudiante[]> {
        return await this.estudianteRepositorio.obtenerTodos();
    }

    async obtenerPorId(id: number): Promise<Estudiante> {
        const estudiante = await this.estudianteRepositorio.obtenerPorId(id);

        if (!estudiante) {
            throw new Error("Estudiante no encontrado");
        }

        return estudiante;
    }

    async buscar(termino: string): Promise<Estudiante[]> {
        if (!termino || termino.trim() === "") {
            return await this.obtenerTodos();
        }

        return await this.estudianteRepositorio.buscar(termino.trim());
    }

    async crear(datos: EstudianteCrear): Promise<Estudiante> {
        this.validarDatosEstudiante(datos);

        const estudianteExistente =
            await this.estudianteRepositorio.obtenerPorDni(datos.dni);

        if (estudianteExistente) {
            throw new Error("Ya existe un estudiante con ese DNI");
        }

        const datosParaCrear = {
            ...datos,
            fechaNacimiento: new Date(datos.fechaNacimiento),
        };

        return await this.estudianteRepositorio.crear(datosParaCrear);
    }

    async actualizar(
        id: number,
        datos: EstudianteActualizar
    ): Promise<Estudiante> {
        const estudiante = await this.obtenerPorId(id);

        if (datos.dni && datos.dni !== estudiante.dni) {
            const estudianteExistente =
                await this.estudianteRepositorio.obtenerPorDni(datos.dni);

            if (estudianteExistente) {
                throw new Error("Ya existe un estudiante con ese DNI");
            }
        }

        const datosParaActualizar: EstudianteActualizar = { ...datos };
        if (datos.fechaNacimiento) {
            datosParaActualizar.fechaNacimiento = new Date(datos.fechaNacimiento);
        }

        return await this.estudianteRepositorio.actualizar(id, datosParaActualizar);
    }

    async eliminar(id: number): Promise<Estudiante> {
        await this.obtenerPorId(id);

        return await this.estudianteRepositorio.eliminar(id);
    }

    async contar(): Promise<number> {
        return await this.estudianteRepositorio.contar();
    }

    private validarDatosEstudiante(datos: EstudianteCrear): void {
        if (!datos.nombres || datos.nombres.trim() === "") {
            throw new Error("Los nombres son requeridos");
        }

        if (!datos.apellidos || datos.apellidos.trim() === "") {
            throw new Error("Los apellidos son requeridos");
        }

        if (!datos.dni || datos.dni.trim() === "") {
            throw new Error("El DNI es requerido");
        }

        if (!datos.fechaNacimiento) {
            throw new Error("La fecha de nacimiento es requerida");
        }

        if (!datos.direccion || datos.direccion.trim() === "") {
            throw new Error("La dirección es requerida");
        }

        if (!datos.telefono || datos.telefono.trim() === "") {
            throw new Error("El teléfono es requerido");
        }
    }
}
