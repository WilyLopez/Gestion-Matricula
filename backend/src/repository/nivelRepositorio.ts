// src/repositorios/nivelRepositorio.ts
import { prisma } from "../configuracion/baseDatos";
import { Nivel } from "@prisma/client";
import { NivelCrear } from "../types";

export class NivelRepositorio {
    async obtenerTodos(): Promise<Nivel[]> {
        return await prisma.nivel.findMany({
            include: {
                grados: true,
            },
            orderBy: {
                id: "asc",
            },
        });
    }

    async obtenerPorId(id: number): Promise<Nivel | null> {
        return await prisma.nivel.findUnique({
            where: { id },
            include: {
                grados: {
                    include: {
                        secciones: true,
                    },
                },
            },
        });
    }

    async crear(datos: NivelCrear): Promise<Nivel> {
        return await prisma.nivel.create({
            data: datos,
        });
    }

    async actualizar(id: number, datos: Partial<NivelCrear>): Promise<Nivel> {
        return await prisma.nivel.update({
            where: { id },
            data: datos,
        });
    }

    async eliminar(id: number): Promise<Nivel> {
        return await prisma.nivel.delete({
            where: { id },
        });
    }
}
