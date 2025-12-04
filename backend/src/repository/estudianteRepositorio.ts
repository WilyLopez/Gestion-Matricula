// src/repository/estudianteRepositorio.ts
import { prisma } from "../configuracion/baseDatos";
import { Estudiante } from "@prisma/client";
import { EstudianteCrear } from "../types";

type OpcionesFiltro = {
    pagina?: number;
    limite?: number;
    busqueda?: string;
    estado?: "matriculado" | "sin-matricula";
};

export class EstudianteRepositorio {
    async obtenerTodos(opciones: OpcionesFiltro = {}): Promise<Estudiante[]> {
        const { pagina = 1, limite = 10, busqueda, estado } = opciones;
        const skip = (pagina - 1) * limite;

        const where: any = {};

        if (busqueda) {
            where.OR = [
                { nombres: { contains: busqueda, mode: "insensitive" } },
                { apellidos: { contains: busqueda, mode: "insensitive" } },
                { dni: { contains: busqueda } },
            ];
        }

        if (estado) {
            if (estado === "matriculado") {
                where.matriculas = { some: { estado: "activa" } };
            } else if (estado === "sin-matricula") {
                where.matriculas = { none: { estado: "activa" } };
            }
        }

        return await prisma.estudiante.findMany({
            where,
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
            skip,
            take: limite,
        });
    }

    async contarTodos(opciones: OpcionesFiltro = {}): Promise<number> {
        const { busqueda, estado } = opciones;

        const where: any = {};

        if (busqueda) {
            where.OR = [
                { nombres: { contains: busqueda, mode: "insensitive" } },
                { apellidos: { contains: busqueda, mode: "insensitive" } },
                { dni: { contains: busqueda } },
            ];
        }

        if (estado) {
            if (estado === "matriculado") {
                where.matriculas = { some: { estado: "activa" } };
            } else if (estado === "sin-matricula") {
                where.matriculas = { none: { estado: "activa" } };
            }
        }

        return await prisma.estudiante.count({ where });
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


}
