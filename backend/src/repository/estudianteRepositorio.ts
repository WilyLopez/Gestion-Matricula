// src/repositorios/estudianteRepositorio.ts
import { prisma } from "../configuracion/baseDatos";
import { Estudiante } from "@prisma/client";
import { EstudianteCrear } from "../types";

export class EstudianteRepositorio {
    async obtenerTodos(): Promise<Estudiante[]> {
        return await prisma.estudiante.findMany({
            include: {
                matriculas: {
                    include: {
                        seccion: {
                            include: {
                                grado: {
                                    include: {
                                        nivel: true,
                                    },
                                },
                            },
                        },
                        anioAcademico: true,
                    },
                },
            },
            orderBy: {
                apellidos: "asc",
            },
        });
    }

    async obtenerPorId(id: number): Promise<Estudiante | null> {
        return await prisma.estudiante.findUnique({
            where: { id },
            include: {
                matriculas: {
                    include: {
                        seccion: {
                            include: {
                                grado: {
                                    include: {
                                        nivel: true,
                                    },
                                },
                                profesor: true,
                            },
                        },
                        anioAcademico: true,
                    },
                    orderBy: {
                        fechaMatricula: "desc",
                    },
                },
            },
        });
    }

    async obtenerPorDni(dni: string): Promise<Estudiante | null> {
        return await prisma.estudiante.findUnique({
            where: { dni },
        });
    }

    async buscar(termino: string): Promise<Estudiante[]> {
        return await prisma.estudiante.findMany({
            where: {
                OR: [
                    { nombres: { contains: termino, mode: "insensitive" } },
                    { apellidos: { contains: termino, mode: "insensitive" } },
                    { dni: { contains: termino } },
                ],
            },
            include: {
                matriculas: {
                    include: {
                        seccion: {
                            include: {
                                grado: {
                                    include: {
                                        nivel: true,
                                    },
                                },
                            },
                        },
                        anioAcademico: true,
                    },
                },
            },
        });
    }

    async crear(datos: EstudianteCrear): Promise<Estudiante> {
        return await prisma.estudiante.create({
            data: datos,
        });
    }

    async actualizar(
        id: number,
        datos: Partial<EstudianteCrear>
    ): Promise<Estudiante> {
        return await prisma.estudiante.update({
            where: { id },
            data: datos,
        });
    }

    async eliminar(id: number): Promise<Estudiante> {
        return await prisma.estudiante.delete({
            where: { id },
        });
    }

    async contar(): Promise<number> {
        return await prisma.estudiante.count();
    }
}
