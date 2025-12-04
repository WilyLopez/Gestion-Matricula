// src/repositorios/anioAcademicoRepositorio.ts
import { prisma } from "../configuracion/baseDatos";
import { AnioAcademico } from "@prisma/client";
import { AnioAcademicoCrear } from "../types";

export class AnioAcademicoRepositorio {
    async obtenerTodos(): Promise<AnioAcademico[]> {
        return await prisma.anioAcademico.findMany({
            include: {
                matriculas: true,
            },
            orderBy: {
                anio: "desc",
            },
        });
    }

    async obtenerPorId(id: number): Promise<AnioAcademico | null> {
        return await prisma.anioAcademico.findUnique({
            where: { id },
            include: {
                matriculas: {
                    include: {
                        estudiante: true,
                        seccion: {
                            include: {
                                grado: {
                                    include: {
                                        nivel: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async obtenerActivo(): Promise<AnioAcademico | null> {
        return await prisma.anioAcademico.findFirst({
            where: { esActivo: true },
            include: {
                matriculas: true,
            },
        });
    }

    async obtenerPorAnio(anio: number): Promise<AnioAcademico | null> {
        return await prisma.anioAcademico.findUnique({
            where: { anio },
        });
    }

    async crear(datos: AnioAcademicoCrear): Promise<AnioAcademico> {
        return await prisma.anioAcademico.create({
            data: datos,
        });
    }

    async actualizar(
        id: number,
        datos: Partial<AnioAcademicoCrear>
    ): Promise<AnioAcademico> {
        return await prisma.anioAcademico.update({
            where: { id },
            data: datos,
        });
    }

    async desactivarTodos(): Promise<void> {
        await prisma.anioAcademico.updateMany({
            where: { esActivo: true },
            data: { esActivo: false },
        });
    }

    async eliminar(id: number): Promise<AnioAcademico> {
        return await prisma.anioAcademico.delete({
            where: { id },
        });
    }
}
