// src/repository/seccionRepositorio.ts
import { prisma } from "../configuracion/baseDatos";
import { Seccion, Prisma } from "@prisma/client";
import { SeccionCrear } from "../types";

export interface ObtenerTodasSeccionesOpciones {
    nivelId?: number;
    gradoId?: number;
    pagina?: number;
    limite?: number;
}

export class SeccionRepositorio {
    async obtenerTodas(opciones: ObtenerTodasSeccionesOpciones = {}): Promise<{ secciones: Seccion[], total: number }> {
        const { nivelId, gradoId, pagina = 1, limite = 10 } = opciones;

        const where: Prisma.SeccionWhereInput = {};
        if (gradoId) {
            where.gradoId = gradoId;
        } else if (nivelId) {
            where.grado = {
                nivelId: nivelId,
            };
        }

        const [secciones, total] = await prisma.$transaction([
            prisma.seccion.findMany({
                where,
                include: {
                    grado: {
                        include: {
                            nivel: true,
                        },
                    },
                    profesor: true,
                    matriculas: {
                        where: {
                            estado: "activa",
                        },
                    },
                },
                skip: (pagina - 1) * limite,
                take: limite,
                orderBy: {
                    id: "asc",
                },
            }),
            prisma.seccion.count({ where }),
        ]);

        return { secciones, total };
    }

    async obtenerPorId(id: number): Promise<Seccion | null> {
        return await prisma.seccion.findUnique({
            where: { id },
            include: {
                grado: {
                    include: {
                        nivel: true,
                    },
                },
                profesor: true,
                matriculas: {
                    include: {
                        estudiante: true,
                        anioAcademico: true,
                    },
                },
            },
        });
    }

    async obtenerPorGrado(gradoId: number): Promise<Seccion[]> {
        return await prisma.seccion.findMany({
            where: { gradoId },
            include: {
                grado: {
                    include: {
                        nivel: true,
                    },
                },
                profesor: true,
                matriculas: {
                    where: {
                        estado: "activa",
                    },
                },
            },
        });
    }

    async obtenerConVacantes(): Promise<Seccion[]> {
        const secciones = await prisma.seccion.findMany({
            include: {
                grado: {
                    include: {
                        nivel: true,
                    },
                },
                profesor: true,
                matriculas: {
                    where: {
                        estado: "activa",
                    },
                },
            },
        });

        return secciones.filter(
            (seccion) => seccion.matriculas.length < seccion.capacidadMaxima
        );
    }

    async crear(datos: SeccionCrear): Promise<Seccion> {
        return await prisma.seccion.create({
            data: datos,
            include: {
                grado: {
                    include: {
                        nivel: true,
                    },
                },
                profesor: true,
            },
        });
    }

    async actualizar(
        id: number,
        datos: Partial<SeccionCrear>
    ): Promise<Seccion> {
        return await prisma.seccion.update({
            where: { id },
            data: datos,
            include: {
                grado: {
                    include: {
                        nivel: true,
                    },
                },
                profesor: true,
            },
        });
    }

    async eliminar(id: number): Promise<Seccion> {
        return await prisma.seccion.delete({
            where: { id },
        });
    }

    async contarMatriculasActivas(id: number): Promise<number> {
        return await prisma.matricula.count({
            where: {
                seccionId: id,
                estado: "activa",
            },
        });
    }

    async verificarExistencia(
        gradoId: number,
        nombre: string
    ): Promise<Seccion | null> {
        return await prisma.seccion.findUnique({
            where: {
                gradoId_nombre: {
                    gradoId,
                    nombre,
                },
            },
        });
    }
}
