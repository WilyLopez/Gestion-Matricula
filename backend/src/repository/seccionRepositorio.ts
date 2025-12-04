// src/repositorios/seccionRepositorio.ts
import { prisma } from "../configuracion/baseDatos";
import { Seccion } from "@prisma/client";
import { SeccionCrear } from "../types";

export class SeccionRepositorio {
    async obtenerTodas(): Promise<Seccion[]> {
        return await prisma.seccion.findMany({
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
            orderBy: {
                id: "asc",
            },
        });
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
