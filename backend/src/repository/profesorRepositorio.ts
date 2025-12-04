// src/repositorios/profesorRepositorio.ts
import { prisma } from "../configuracion/baseDatos";
import { Profesor } from "@prisma/client";
import { ProfesorCrear } from "../types";

export class ProfesorRepositorio {
    async obtenerTodos(): Promise<Profesor[]> {
        return await prisma.profesor.findMany({
            include: {
                secciones: {
                    include: {
                        grado: {
                            include: {
                                nivel: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                apellidos: "asc",
            },
        });
    }

    async obtenerPorId(id: number): Promise<Profesor | null> {
        return await prisma.profesor.findUnique({
            where: { id },
            include: {
                secciones: {
                    include: {
                        grado: {
                            include: {
                                nivel: true,
                            },
                        },
                        matriculas: {
                            where: {
                                estado: "activa",
                            },
                        },
                    },
                },
            },
        });
    }

    async obtenerPorDni(dni: string): Promise<Profesor | null> {
        return await prisma.profesor.findUnique({
            where: { dni },
        });
    }

    async buscar(termino: string): Promise<Profesor[]> {
        return await prisma.profesor.findMany({
            where: {
                OR: [
                    { nombres: { contains: termino, mode: "insensitive" } },
                    { apellidos: { contains: termino, mode: "insensitive" } },
                    { dni: { contains: termino } },
                    { email: { contains: termino, mode: "insensitive" } },
                ],
            },
            include: {
                secciones: {
                    include: {
                        grado: {
                            include: {
                                nivel: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async crear(datos: ProfesorCrear): Promise<Profesor> {
        return await prisma.profesor.create({
            data: datos,
        });
    }

    async actualizar(
        id: number,
        datos: Partial<ProfesorCrear>
    ): Promise<Profesor> {
        return await prisma.profesor.update({
            where: { id },
            data: datos,
        });
    }

    async eliminar(id: number): Promise<Profesor> {
        return await prisma.profesor.delete({
            where: { id },
        });
    }

    async contar(): Promise<number> {
        return await prisma.profesor.count();
    }
}
