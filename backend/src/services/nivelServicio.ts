// src/servicios/nivelServicio.ts
import { NivelRepositorio } from "../repository/nivelRepositorio";
import { Nivel } from "@prisma/client";
import { NivelCrear } from "../types";

export class NivelServicio {
    private nivelRepositorio: NivelRepositorio;

    constructor() {
        this.nivelRepositorio = new NivelRepositorio();
    }

    async obtenerTodos(): Promise<Nivel[]> {
        return await this.nivelRepositorio.obtenerTodos();
    }

    async obtenerPorId(id: number): Promise<Nivel> {
        const nivel = await this.nivelRepositorio.obtenerPorId(id);

        if (!nivel) {
            throw new Error("Nivel no encontrado");
        }

        return nivel;
    }

    async crear(datos: NivelCrear): Promise<Nivel> {
        if (!datos.nombre || datos.nombre.trim() === "") {
            throw new Error("El nombre del nivel es requerido");
        }

        return await this.nivelRepositorio.crear(datos);
    }

    async actualizar(id: number, datos: Partial<NivelCrear>): Promise<Nivel> {
        await this.obtenerPorId(id);

        if (datos.nombre && datos.nombre.trim() === "") {
            throw new Error("El nombre del nivel no puede estar vacío");
        }

        return await this.nivelRepositorio.actualizar(id, datos);
    }

    async eliminar(id: number): Promise<Nivel> {
        await this.obtenerPorId(id);

        return await this.nivelRepositorio.eliminar(id);
    }
}
