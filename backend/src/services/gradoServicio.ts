// src/servicios/gradoServicio.ts
import { GradoRepositorio } from "../repository/gradoRepositorio";
import { NivelRepositorio } from "../repository/nivelRepositorio";
import { Grado } from "@prisma/client";
import { GradoCrear } from "../types";

export class GradoServicio {
    private gradoRepositorio: GradoRepositorio;
    private nivelRepositorio: NivelRepositorio;

    constructor() {
        this.gradoRepositorio = new GradoRepositorio();
        this.nivelRepositorio = new NivelRepositorio();
    }

    async obtenerTodos(): Promise<Grado[]> {
        return await this.gradoRepositorio.obtenerTodos();
    }

    async obtenerPorNivel(nivelId: number): Promise<Grado[]> {
        const nivel = await this.nivelRepositorio.obtenerPorId(nivelId);

        if (!nivel) {
            throw new Error("Nivel no encontrado");
        }

        return await this.gradoRepositorio.obtenerPorNivel(nivelId);
    }

    async obtenerPorId(id: number): Promise<Grado> {
        const grado = await this.gradoRepositorio.obtenerPorId(id);

        if (!grado) {
            throw new Error("Grado no encontrado");
        }

        return grado;
    }

    async crear(datos: GradoCrear): Promise<Grado> {
        if (!datos.nombre || datos.nombre.trim() === "") {
            throw new Error("El nombre del grado es requerido");
        }

        const nivel = await this.nivelRepositorio.obtenerPorId(datos.nivelId);

        if (!nivel) {
            throw new Error("El nivel especificado no existe");
        }

        return await this.gradoRepositorio.crear(datos);
    }

    async actualizar(id: number, datos: Partial<GradoCrear>): Promise<Grado> {
        await this.obtenerPorId(id);

        if (datos.nombre && datos.nombre.trim() === "") {
            throw new Error("El nombre del grado no puede estar vacío");
        }

        if (datos.nivelId) {
            const nivel = await this.nivelRepositorio.obtenerPorId(
                datos.nivelId
            );

            if (!nivel) {
                throw new Error("El nivel especificado no existe");
            }
        }

        return await this.gradoRepositorio.actualizar(id, datos);
    }

    async eliminar(id: number): Promise<Grado> {
        await this.obtenerPorId(id);

        return await this.gradoRepositorio.eliminar(id);
    }
}
