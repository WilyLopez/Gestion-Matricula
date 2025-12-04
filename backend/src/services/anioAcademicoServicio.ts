// src/servicios/anioAcademicoServicio.ts
import { AnioAcademicoRepositorio } from "../repository/anioAcademicoRepositorio";
import { AnioAcademico } from "@prisma/client";
import { AnioAcademicoCrear } from "../types";

export class AnioAcademicoServicio {
    private anioAcademicoRepositorio: AnioAcademicoRepositorio;

    constructor() {
        this.anioAcademicoRepositorio = new AnioAcademicoRepositorio();
    }

    async obtenerTodos(): Promise<AnioAcademico[]> {
        return await this.anioAcademicoRepositorio.obtenerTodos();
    }

    async obtenerPorId(id: number): Promise<AnioAcademico> {
        const anioAcademico = await this.anioAcademicoRepositorio.obtenerPorId(
            id
        );

        if (!anioAcademico) {
            throw new Error("Año académico no encontrado");
        }

        return anioAcademico;
    }

    async obtenerActivo(): Promise<AnioAcademico> {
        const anioActivo = await this.anioAcademicoRepositorio.obtenerActivo();

        if (!anioActivo) {
            throw new Error("No hay un año académico activo");
        }

        return anioActivo;
    }

    async crear(datos: AnioAcademicoCrear): Promise<AnioAcademico> {
        if (!datos.anio || datos.anio < 2000) {
            throw new Error("El año académico no es válido");
        }

        const anioExistente =
            await this.anioAcademicoRepositorio.obtenerPorAnio(datos.anio);

        if (anioExistente) {
            throw new Error("Ya existe un año académico con ese año");
        }

        if (datos.esActivo) {
            await this.anioAcademicoRepositorio.desactivarTodos();
        }

        return await this.anioAcademicoRepositorio.crear(datos);
    }

    async actualizar(
        id: number,
        datos: Partial<AnioAcademicoCrear>
    ): Promise<AnioAcademico> {
        await this.obtenerPorId(id);

        if (datos.esActivo) {
            await this.anioAcademicoRepositorio.desactivarTodos();
        }

        return await this.anioAcademicoRepositorio.actualizar(id, datos);
    }

    async activar(id: number): Promise<AnioAcademico> {
        await this.obtenerPorId(id);
        await this.anioAcademicoRepositorio.desactivarTodos();

        return await this.anioAcademicoRepositorio.actualizar(id, {
            esActivo: true,
        });
    }

    async eliminar(id: number): Promise<AnioAcademico> {
        await this.obtenerPorId(id);

        return await this.anioAcademicoRepositorio.eliminar(id);
    }
}
