// src/repositorios/gradoRepositorio.ts
import { prisma } from "../configuracion/baseDatos";
import { Grado } from "@prisma/client";
import { GradoCrear } from "../types";

export class GradoRepositorio {
    async obtenerTodos(): Promise<Grado[]> {
        return await prisma.grado.findMany({
            include: {
                nivel: true,
                secciones: true,
            },
            orderBy: {
                id: "asc",
            },
        });
    }

    async obtenerPorNivel(nivelId: number): Promise<Grado[]> {
        return await prisma.grado.findMany({
            where: { nivelId },
            include: {
                nivel: true,
                secciones: true,
            },
            orderBy: {
                id: "asc",
            },
        });
    }

    async obtenerPorId(id: number): Promise<Grado | null> {
        return await prisma.grado.findUnique({
            where: { id },
            include: {
                nivel: true,
                secciones: {
                    include: {
                        profesor: true,
                    },
                },
            },
        });
    }

    async crear(datos: GradoCrear): Promise<Grado> {
        return await prisma.grado.create({
            data: datos,
            include: {
                nivel: true,
            },
        });
    }

    async actualizar(id: number, datos: Partial<GradoCrear>): Promise<Grado> {
        return await prisma.grado.update({
            where: { id },
            data: datos,
            include: {
                nivel: true,
            },
        });
    }

    async eliminar(id: number): Promise<Grado> {
        return await prisma.grado.delete({
            where: { id },
        });
    }
}
