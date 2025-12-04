// src/composables/useAlerta.ts
import { ref } from "vue";

export interface Alerta {
    tipo: "success" | "danger" | "warning" | "info";
    mensaje: string;
    visible: boolean;
}

export function useAlerta() {
    const alerta = ref<Alerta>({
        tipo: "info",
        mensaje: "",
        visible: false,
    });

    const mostrarAlerta = (
        tipo: Alerta["tipo"],
        mensaje: string,
        duracion: number = 5000
    ) => {
        alerta.value = {
            tipo,
            mensaje,
            visible: true,
        };

        if (duracion > 0) {
            setTimeout(() => {
                cerrarAlerta();
            }, duracion);
        }
    };

    const cerrarAlerta = () => {
        alerta.value.visible = false;
    };

    const mostrarExito = (mensaje: string) => mostrarAlerta("success", mensaje);
    const mostrarError = (mensaje: string) => mostrarAlerta("danger", mensaje);
    const mostrarAdvertencia = (mensaje: string) =>
        mostrarAlerta("warning", mensaje);
    const mostrarInfo = (mensaje: string) => mostrarAlerta("info", mensaje);

    return {
        alerta,
        mostrarAlerta,
        cerrarAlerta,
        mostrarExito,
        mostrarError,
        mostrarAdvertencia,
        mostrarInfo,
    };
}
