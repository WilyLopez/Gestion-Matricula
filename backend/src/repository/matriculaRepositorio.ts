import { prisma } from "../configuracion/baseDatos";
import { Matricula } from "@prisma/client";
import { MatriculaCrear, MatriculaActualizar } from "../types";

export class MatriculaRepositorio {
    async obtenerTodas(): Promise<Matricula[]> {
        return await prisma.matricula.findMany({
            include: {
                estudiante: true,
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
        });
    }

    async obtenerPorId(id: number): Promise<Matricula | null> {
        return await prisma.matricula.findUnique({
            where: { id },
            include: {
                estudiante: true,
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
        });
    }

    async obtenerPorEstudiante(estudianteId: number): Promise<Matricula[]> {
        return await prisma.matricula.findMany({
            where: { estudianteId },
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
        });
    }

    async obtenerPorSeccion(seccionId: number): Promise<Matricula[]> {
        return await prisma.matricula.findMany({
            where: { seccionId },
            include: {
                estudiante: true,
                anioAcademico: true,
            },
            orderBy: {
                estudiante: {
                    apellidos: "asc",
                },
            },
        });
    }

    async obtenerPorAnioAcademico(
        anioAcademicoId: number
    ): Promise<Matricula[]> {
        return await prisma.matricula.findMany({
            where: { anioAcademicoId },
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
        });
    }

    async verificarMatriculaExistente(
        estudianteId: number,
        seccionId: number,
        anioAcademicoId: number
    ): Promise<Matricula | null> {
        return await prisma.matricula.findUnique({
            where: {
                estudianteId_seccionId_anioAcademicoId: {
                    estudianteId,
                    seccionId,
                    anioAcademicoId,
                },
            },
        });
    }

    async contarMatriculasActivas(anioAcademicoId: number): Promise<number> {
        return await prisma.matricula.count({
            where: {
                anioAcademicoId,
                estado: "activa",
            },
        });
    }

    async contarPorNivel(anioAcademicoId: number): Promise<any[]> {
        return await prisma.$queryRaw`
      SELECT n.nombre as nivel, COUNT(m.id)::int as cantidad
      FROM matriculas m
      INNER JOIN secciones s ON m.seccion_id = s.id
      INNER JOIN grados g ON s.grado_id = g.id
      INNER JOIN niveles n ON g.nivel_id = n.id
      WHERE m.anio_academico_id = ${anioAcademicoId} AND m.estado = 'activa'
      GROUP BY n.nombre
      ORDER BY n.nombre
    `;
    }

    async crear(datos: MatriculaCrear): Promise<Matricula> {
        return await prisma.matricula.create({
            data: datos,
            include: {
                estudiante: true,
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
        });
    }

    async actualizar(
        id: number,
        datos: Partial<MatriculaCrear> | MatriculaActualizar
    ): Promise<Matricula> {
        return await prisma.matricula.update({
            where: { id },
            data: datos,
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
                anioAcademico: true,
            },
        });
    }

    async eliminar(id: number): Promise<Matricula> {
        return await prisma.matricula.delete({
            where: { id },
        });
    }
}
