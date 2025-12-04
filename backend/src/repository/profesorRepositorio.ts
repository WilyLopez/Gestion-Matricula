// src/repository/profesorRepositorio.ts
import { prisma } from "../configuracion/baseDatos";
import { Profesor, Prisma } from "@prisma/client";
import { ProfesorCrear, ProfesorConRelaciones } from "../types";

type OpcionesFiltro = {
    pagina?: number;
    limite?: number;
    busqueda?: string;
};

export class ProfesorRepositorio {
    async obtenerTodos(
        opciones: OpcionesFiltro = {}
    ): Promise<ProfesorConRelaciones[]> {
        const { pagina = 1, limite = 10, busqueda } = opciones;
        const skip = (pagina - 1) * limite;

        const where: Prisma.ProfesorWhereInput = {};

        if (busqueda) {
            where.OR = [
                { nombres: { contains: busqueda, mode: "insensitive" } },
                { apellidos: { contains: busqueda, mode: "insensitive" } },
                { dni: { contains: busqueda } },
                { email: { contains: busqueda, mode: "insensitive" } },
            ];
        }

        return await prisma.profesor.findMany({
            where,
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
            orderBy: {
                apellidos: "asc",
            },
            skip,
            take: limite,
        });
    }

    async contarTodos(opciones: OpcionesFiltro = {}): Promise<number> {
        const { busqueda } = opciones;

        const where: Prisma.ProfesorWhereInput = {};

        if (busqueda) {
            where.OR = [
                { nombres: { contains: busqueda, mode: "insensitive" } },
                { apellidos: { contains: busqueda, mode: "insensitive" } },
                { dni: { contains: busqueda } },
                { email: { contains: busqueda, mode: "insensitive" } },
            ];
        }

        return await prisma.profesor.count({ where });
    }

    async obtenerPorId(id: number): Promise<ProfesorConRelaciones | null> {
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
}
