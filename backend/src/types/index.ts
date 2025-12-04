// src/tipos/index.ts

import { Prisma } from '@prisma/client'; // Importar Prisma para los tipos de payload

export interface Paginated<T> {
    registros: T[];
    total: number;
}
export interface RespuestaApi<T = any> {
    exito: boolean;
    mensaje: string;
    datos?: T;
    error?: string;
}

// Definir el tipo para Seccion con sus relaciones incluidas
export type SeccionConRelaciones = Prisma.SeccionGetPayload<{
    include: {
        grado: {
            include: { nivel: true }
        },
        profesor: true,
        matriculas: {
            where: { estado: "activa" }
        }
    }
}>;

export type ProfesorConRelaciones = Prisma.ProfesorGetPayload<{
    include: {
        secciones: {
            include: {
                grado: {
                    include: {
                        nivel: true;
                    };
                };
                matriculas: {
                    where: {
                        estado: "activa";
                    };
                };
            };
        };
    };
}>;

export interface EstudianteCrear {
    nombres: string;
    apellidos: string;
    dni: string;
    fechaNacimiento: Date;
    direccion: string;
    telefono: string;
}

export interface EstudianteActualizar {
    nombres?: string;
    apellidos?: string;
    dni?: string;
    fechaNacimiento?: Date;
    direccion?: string;
    telefono?: string;
}

export interface ProfesorCrear {
    nombres: string;
    apellidos: string;
    dni: string;
    especialidad: string;
    telefono: string;
    email: string;
}

export interface ProfesorActualizar {
    nombres?: string;
    apellidos?: string;
    dni?: string;
    especialidad?: string;
    telefono?: string;
    email?: string;
}

export interface SeccionCrear {
    gradoId: number;
    nombre: string;
    capacidadMaxima: number;
    turno: string;
    profesorId?: number;
}

export interface SeccionActualizar {
    nombre?: string;
    capacidadMaxima?: number;
    turno?: string;
    profesorId?: number;
}

export interface MatriculaCrear {
    estudianteId: number;
    seccionId: number;
    anioAcademicoId: number;
}

export interface MatriculaActualizar {
    estado: string;
}

export interface NivelCrear {
    nombre: string;
}

export interface GradoCrear {
    nivelId: number;
    nombre: string;
}

export interface AnioAcademicoCrear {
    anio: number;
    esActivo: boolean;
}

export interface EstadisticasPanel {
    totalEstudiantes: number;
    totalEstudiantesMatriculados: number;
    totalProfesores: number;
    estudiantesPorNivel: Array<{
        nivel: string;
        cantidad: number;
    }>;
    seccionesConMasEstudiantes: Array<{
        seccion: string;
        grado: string;
        nivel: string;
        cantidad: number;
    }>;
    seccionesConVacantes: Array<{
        seccion: string;
        grado: string;
        nivel: string;
        vacantes: number;
    }>;
}
