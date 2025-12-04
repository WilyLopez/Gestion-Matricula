// src/tipos/index.ts

export interface RespuestaApi<T = any> {
    exito: boolean;
    mensaje: string;
    datos?: T;
    error?: string;
}

export interface Nivel {
    id: number;
    nombre: string;
    creadoEn: string;
    grados?: Grado[];
}

export interface Grado {
    id: number;
    nivelId: number;
    nombre: string;
    creadoEn: string;
    nivel?: Nivel;
    secciones?: Seccion[];
}

export interface Profesor {
    id: number;
    nombres: string;
    apellidos: string;
    dni: string;
    especialidad: string;
    telefono: string;
    email: string;
    creadoEn: string;
    actualizadoEn: string;
    secciones?: Seccion[];
}

export interface Estudiante {
    id: number;
    nombres: string;
    apellidos: string;
    dni: string;
    fechaNacimiento: string;
    direccion: string;
    telefono: string;
    creadoEn: string;
    actualizadoEn: string;
    matriculas?: Matricula[];
}

export interface Seccion {
    id: number;
    gradoId: number;
    nombre: string;
    capacidadMaxima: number;
    turno: string;
    profesorId: number | null;
    creadoEn: string;
    actualizadoEn: string;
    grado?: Grado;
    profesor?: Profesor;
    matriculas?: Matricula[];
}

export interface AnioAcademico {
    id: number;
    anio: number;
    esActivo: boolean;
    creadoEn: string;
    matriculas?: Matricula[];
}

export interface Matricula {
    id: number;
    estudianteId: number;
    seccionId: number;
    anioAcademicoId: number;
    fechaMatricula: string;
    estado: string;
    creadoEn: string;
    actualizadoEn: string;
    estudiante?: Estudiante;
    seccion?: Seccion;
    anioAcademico?: AnioAcademico;
}

export interface EstudianteFormulario {
    nombres: string;
    apellidos: string;
    dni: string;
    fechaNacimiento: string;
    direccion: string;
    telefono: string;
}

export interface ProfesorFormulario {
    nombres: string;
    apellidos: string;
    dni: string;
    especialidad: string;
    telefono: string;
    email: string;
}

export interface SeccionFormulario {
    gradoId: number;
    nombre: string;
    capacidadMaxima: number;
    turno: string;
    profesorId?: number;
}

export interface MatriculaFormulario {
    estudianteId: number;
    seccionId: number;
    anioAcademicoId: number;
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

export interface OpcionSelect {
    valor: number | string;
    etiqueta: string;
}
