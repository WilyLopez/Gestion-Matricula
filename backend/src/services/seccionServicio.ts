// src/services/seccionServicio.ts
import { SeccionRepositorio, ObtenerTodasSeccionesOpciones } from "../repository/seccionRepositorio";
import { GradoRepositorio } from "../repository/gradoRepositorio";
import { ProfesorRepositorio } from "../repository/profesorRepositorio";
import { Seccion } from "@prisma/client";
import { SeccionCrear, SeccionActualizar } from "../types";

export class SeccionServicio {
    private seccionRepositorio: SeccionRepositorio;
    private gradoRepositorio: GradoRepositorio;
    private profesorRepositorio: ProfesorRepositorio;

    constructor() {
        this.seccionRepositorio = new SeccionRepositorio();
        this.gradoRepositorio = new GradoRepositorio();
        this.profesorRepositorio = new ProfesorRepositorio();
    }

    async obtenerTodas(opciones: ObtenerTodasSeccionesOpciones): Promise<{ secciones: Seccion[], total: number }> {
        return await this.seccionRepositorio.obtenerTodas(opciones);
    }

    async obtenerPorId(id: number): Promise<Seccion> {
        const seccion = await this.seccionRepositorio.obtenerPorId(id);

        if (!seccion) {
            throw new Error("Sección no encontrada");
        }

        return seccion;
    }

    async obtenerPorGrado(gradoId: number): Promise<Seccion[]> {
        const grado = await this.gradoRepositorio.obtenerPorId(gradoId);

        if (!grado) {
            throw new Error("Grado no encontrado");
        }

        return await this.seccionRepositorio.obtenerPorGrado(gradoId);
    }

    async obtenerConVacantes(): Promise<Seccion[]> {
        return await this.seccionRepositorio.obtenerConVacantes();
    }

    async crear(datos: SeccionCrear): Promise<Seccion> {
        this.validarDatosSeccion(datos);

        const grado = await this.gradoRepositorio.obtenerPorId(datos.gradoId);

        if (!grado) {
            throw new Error("El grado especificado no existe");
        }

        const seccionExistente =
            await this.seccionRepositorio.verificarExistencia(
                datos.gradoId,
                datos.nombre
            );

        if (seccionExistente) {
            throw new Error(
                "Ya existe una sección con ese nombre en el grado especificado"
            );
        }

        if (datos.profesorId) {
            const profesor = await this.profesorRepositorio.obtenerPorId(
                datos.profesorId
            );

            if (!profesor) {
                throw new Error("El profesor especificado no existe");
            }
        }

        return await this.seccionRepositorio.crear(datos);
    }

    async actualizar(id: number, datos: SeccionActualizar): Promise<Seccion> {
        await this.obtenerPorId(id);

        if (datos.capacidadMaxima !== undefined && datos.capacidadMaxima <= 0) {
            throw new Error("La capacidad máxima debe ser mayor a 0");
        }

        if (datos.profesorId) {
            const profesor = await this.profesorRepositorio.obtenerPorId(
                datos.profesorId
            );

            if (!profesor) {
                throw new Error("El profesor especificado no existe");
            }
        }

        return await this.seccionRepositorio.actualizar(id, datos);
    }

    async eliminar(id: number): Promise<Seccion> {
        await this.obtenerPorId(id);

        const cantidadMatriculas =
            await this.seccionRepositorio.contarMatriculasActivas(id);

        if (cantidadMatriculas > 0) {
            throw new Error(
                "No se puede eliminar la sección porque tiene estudiantes matriculados"
            );
        }

        return await this.seccionRepositorio.eliminar(id);
    }

    private validarDatosSeccion(datos: SeccionCrear): void {
        if (!datos.nombre || datos.nombre.trim() === "") {
            throw new Error("El nombre de la sección es requerido");
        }

        if (!datos.capacidadMaxima || datos.capacidadMaxima <= 0) {
            throw new Error("La capacidad máxima debe ser mayor a 0");
        }

        if (!datos.turno || datos.turno.trim() === "") {
            throw new Error("El turno es requerido");
        }

        const turnosValidos = ["mañana", "tarde"];
        if (!turnosValidos.includes(datos.turno.toLowerCase())) {
            throw new Error('El turno debe ser "mañana" o "tarde"');
        }
    }
}
