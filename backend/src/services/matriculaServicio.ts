// src/servicios/matriculaServicio.ts
import { MatriculaRepositorio } from "../repository/matriculaRepositorio";
import { EstudianteRepositorio } from "../repository/estudianteRepositorio";
import { SeccionRepositorio } from "../repository/seccionRepositorio";
import { AnioAcademicoRepositorio } from "../repository/anioAcademicoRepositorio";
import { Matricula } from "@prisma/client";
import { MatriculaCrear, MatriculaActualizar } from "../types";

export class MatriculaServicio {
    private matriculaRepositorio: MatriculaRepositorio;
    private estudianteRepositorio: EstudianteRepositorio;
    private seccionRepositorio: SeccionRepositorio;
    private anioAcademicoRepositorio: AnioAcademicoRepositorio;

    constructor() {
        this.matriculaRepositorio = new MatriculaRepositorio();
        this.estudianteRepositorio = new EstudianteRepositorio();
        this.seccionRepositorio = new SeccionRepositorio();
        this.anioAcademicoRepositorio = new AnioAcademicoRepositorio();
    }

    async obtenerTodas(): Promise<Matricula[]> {
        return await this.matriculaRepositorio.obtenerTodas();
    }

    async obtenerPorId(id: number): Promise<Matricula> {
        const matricula = await this.matriculaRepositorio.obtenerPorId(id);

        if (!matricula) {
            throw new Error("Matrícula no encontrada");
        }

        return matricula;
    }

    async obtenerPorEstudiante(estudianteId: number): Promise<Matricula[]> {
        const estudiante = await this.estudianteRepositorio.obtenerPorId(
            estudianteId
        );

        if (!estudiante) {
            throw new Error("Estudiante no encontrado");
        }

        return await this.matriculaRepositorio.obtenerPorEstudiante(
            estudianteId
        );
    }

    async obtenerPorSeccion(seccionId: number): Promise<Matricula[]> {
        const seccion = await this.seccionRepositorio.obtenerPorId(seccionId);

        if (!seccion) {
            throw new Error("Sección no encontrada");
        }

        return await this.matriculaRepositorio.obtenerPorSeccion(seccionId);
    }

    async crear(datos: MatriculaCrear): Promise<Matricula> {
        const estudiante = await this.estudianteRepositorio.obtenerPorId(
            datos.estudianteId
        );
        if (!estudiante) {
            throw new Error("Estudiante no encontrado");
        }

        const seccion = await this.seccionRepositorio.obtenerPorId(
            datos.seccionId
        );
        if (!seccion) {
            throw new Error("Sección no encontrada");
        }

        const anioAcademico = await this.anioAcademicoRepositorio.obtenerPorId(
            datos.anioAcademicoId
        );
        if (!anioAcademico) {
            throw new Error("Año académico no encontrado");
        }

        const matriculaExistente =
            await this.matriculaRepositorio.verificarMatriculaExistente(
                datos.estudianteId,
                datos.seccionId,
                datos.anioAcademicoId
            );

        if (matriculaExistente) {
            throw new Error(
                "El estudiante ya está matriculado en esta sección para este año académico"
            );
        }

        const cantidadMatriculas =
            await this.seccionRepositorio.contarMatriculasActivas(
                datos.seccionId
            );

        if (cantidadMatriculas >= seccion.capacidadMaxima) {
            throw new Error("La sección ha alcanzado su capacidad máxima");
        }

        return await this.matriculaRepositorio.crear(datos);
    }

    async actualizarEstado(id: number, estado: string): Promise<Matricula> {
        await this.obtenerPorId(id);

        const estadosValidos = ["activa", "retirado", "culminado"];
        if (!estadosValidos.includes(estado.toLowerCase())) {
            throw new Error(
                "Estado no válido. Debe ser: activa, retirado o culminado"
            );
        }

        return await this.matriculaRepositorio.actualizar(id, {
            estado: estado.toLowerCase(),
        });
    }

    async eliminar(id: number): Promise<Matricula> {
        await this.obtenerPorId(id);

        return await this.matriculaRepositorio.eliminar(id);
    }
}
