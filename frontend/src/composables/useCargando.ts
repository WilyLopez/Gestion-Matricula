// src/composables/useCargando.ts
import { ref } from "vue";

export function useCargando() {
    const cargando = ref<boolean>(false);

    const iniciarCarga = () => {
        cargando.value = true;
    };

    const detenerCarga = () => {
        cargando.value = false;
    };

    const ejecutarConCarga = async <T>(fn: () => Promise<T>): Promise<T> => {
        iniciarCarga();
        try {
            return await fn();
        } finally {
            detenerCarga();
        }
    };

    return {
        cargando,
        iniciarCarga,
        detenerCarga,
        ejecutarConCarga,
    };
}
