// src/composables/useValidacionMatricula.ts
import { Estudiante, Seccion, AnioAcademico, Matricula } from "@/tipos";

export interface ResultadoValidacion {
    valido: boolean;
    errores: string[];
    advertencias: string[];
}

export function useValidacionMatricula() {
    const validarMatricula = (
        estudiante: Estudiante | null,
        seccion: Seccion | null,
        anioAcademico: AnioAcademico | null,
        matriculasExistentes: Matricula[] = []
    ): ResultadoValidacion => {
        const errores: string[] = [];
        const advertencias: string[] = [];

        if (!estudiante) {
            errores.push("Debe seleccionar un estudiante");
        }

        if (!seccion) {
            errores.push("Debe seleccionar una sección");
        }

        if (!anioAcademico) {
            errores.push("No hay un año académico activo");
        }

        if (errores.length > 0) {
            return { valido: false, errores, advertencias };
        }

        if (estudiante && anioAcademico) {
            const matriculasActivas = matriculasExistentes.filter(
                (m) =>
                    m.estudianteId === estudiante.id &&
                    m.estado === "activa" &&
                    m.anioAcademicoId === anioAcademico.id
            );

            if (matriculasActivas.length > 0) {
                errores.push(
                    "El estudiante ya tiene una matrícula activa en este año académico"
                );
            }

            if (
                seccion &&
                matriculasActivas.some((m) => m.seccionId === seccion.id)
            ) {
                errores.push(
                    "El estudiante ya está matriculado en esta sección"
                );
            }
        }

        if (seccion) {
            const matriculasEnSeccion = matriculasExistentes.filter(
                (m) => m.seccionId === seccion.id && m.estado === "activa"
            );

            const cuposDisponibles =
                seccion.capacidadMaxima - matriculasEnSeccion.length;

            if (cuposDisponibles <= 0) {
                errores.push(
                    `La sección ${seccion.nombre} no tiene cupos disponibles`
                );
            } else if (cuposDisponibles <= 3) {
                advertencias.push(
                    `Solo quedan ${cuposDisponibles} cupos disponibles en esta sección`
                );
            }

            if (!seccion.profesorId) {
                advertencias.push(
                    "Esta sección no tiene un profesor tutor asignado"
                );
            }
        }

        if (estudiante) {
            const edad = calcularEdad(estudiante.fechaNacimiento);

            if (
                seccion?.grado?.nivel?.nombre === "Primaria" &&
                (edad < 6 || edad > 12)
            ) {
                advertencias.push(
                    `La edad del estudiante (${edad} años) está fuera del rango típico para Primaria`
                );
            }

            if (
                seccion?.grado?.nivel?.nombre === "Secundaria" &&
                (edad < 12 || edad > 18)
            ) {
                advertencias.push(
                    `La edad del estudiante (${edad} años) está fuera del rango típico para Secundaria`
                );
            }
        }

        return {
            valido: errores.length === 0,
            errores,
            advertencias,
        };
    };

    const validarCambioEstado = (
        matricula: Matricula,
        nuevoEstado: string
    ): ResultadoValidacion => {
        const errores: string[] = [];
        const advertencias: string[] = [];

        const estadosValidos = ["activa", "retirado", "culminado"];
        if (!estadosValidos.includes(nuevoEstado)) {
            errores.push("Estado no válido");
        }

        if (matricula.estado === nuevoEstado) {
            errores.push("La matrícula ya tiene este estado");
        }

        if (matricula.estado === "culminado") {
            errores.push("No se puede modificar una matrícula culminada");
        }

        if (nuevoEstado === "retirado") {
            advertencias.push(
                "Esta acción marcará al estudiante como retirado de la sección"
            );
        }

        return {
            valido: errores.length === 0,
            errores,
            advertencias,
        };
    };

    const calcularEdad = (fechaNacimiento: string): number => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        return edad;
    };

    return {
        validarMatricula,
        validarCambioEstado,
        calcularEdad,
    };
}
