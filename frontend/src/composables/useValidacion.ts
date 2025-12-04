// src/composables/useValidacion.ts
import { ref, computed } from "vue";

export interface ReglasValidacion {
    requerido?: boolean;
    minLongitud?: number;
    maxLongitud?: number;
    patron?: RegExp;
    email?: boolean;
    dni?: boolean;
    telefono?: boolean;
    fecha?: boolean;
    numero?: boolean;
    min?: number;
    max?: number;
    mensajePersonalizado?: string;
}

export interface CampoValidacion {
    valor: any;
    reglas: ReglasValidacion;
    tocado: boolean;
    error: string;
}

export function useValidacion() {
    const validarCampo = (campo: CampoValidacion): boolean => {
        const { valor, reglas } = campo;
        campo.error = "";

        if (reglas.requerido && (!valor || valor.toString().trim() === "")) {
            campo.error =
                reglas.mensajePersonalizado || "Este campo es requerido";
            return false;
        }

        if (!valor || valor.toString().trim() === "") {
            return true;
        }

        if (
            reglas.minLongitud &&
            valor.toString().length < reglas.minLongitud
        ) {
            campo.error = `Debe tener al menos ${reglas.minLongitud} caracteres`;
            return false;
        }

        if (
            reglas.maxLongitud &&
            valor.toString().length > reglas.maxLongitud
        ) {
            campo.error = `No debe exceder ${reglas.maxLongitud} caracteres`;
            return false;
        }

        if (reglas.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(valor)) {
                campo.error = "Ingrese un email válido";
                return false;
            }
        }

        if (reglas.dni) {
            const dniRegex = /^[0-9]{8}$/;
            if (!dniRegex.test(valor)) {
                campo.error = "El DNI debe tener 8 dígitos";
                return false;
            }
        }

        if (reglas.telefono) {
            const telefonoRegex = /^[0-9]{9}$/;
            if (!telefonoRegex.test(valor)) {
                campo.error = "El teléfono debe tener 9 dígitos";
                return false;
            }
        }

        if (reglas.fecha) {
            const fecha = new Date(valor);
            if (isNaN(fecha.getTime())) {
                campo.error = "Ingrese una fecha válida";
                return false;
            }
        }

        if (reglas.numero && isNaN(Number(valor))) {
            campo.error = "Debe ser un número válido";
            return false;
        }

        if (reglas.min !== undefined && Number(valor) < reglas.min) {
            campo.error = `El valor mínimo es ${reglas.min}`;
            return false;
        }

        if (reglas.max !== undefined && Number(valor) > reglas.max) {
            campo.error = `El valor máximo es ${reglas.max}`;
            return false;
        }

        if (reglas.patron && !reglas.patron.test(valor)) {
            campo.error = reglas.mensajePersonalizado || "Formato inválido";
            return false;
        }

        return true;
    };

    const validarFormulario = (
        campos: Record<string, CampoValidacion>
    ): boolean => {
        let esValido = true;

        Object.values(campos).forEach((campo) => {
            campo.tocado = true;
            if (!validarCampo(campo)) {
                esValido = false;
            }
        });

        return esValido;
    };

    const limpiarValidacion = (campos: Record<string, CampoValidacion>) => {
        Object.values(campos).forEach((campo) => {
            campo.tocado = false;
            campo.error = "";
        });
    };

    const resetearCampos = (campos: Record<string, CampoValidacion>) => {
        Object.values(campos).forEach((campo) => {
            campo.valor = "";
            campo.tocado = false;
            campo.error = "";
        });
    };

    return {
        validarCampo,
        validarFormulario,
        limpiarValidacion,
        resetearCampos,
    };
}
