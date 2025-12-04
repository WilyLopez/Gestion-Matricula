<!-- src/componentes/comunes/Alerta.vue -->
<script setup lang="ts">
import { computed } from "vue";

interface Props {
    tipo: "success" | "danger" | "warning" | "info";
    mensaje: string;
    visible: boolean;
    dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    dismissible: true,
});

const emit = defineEmits<{
    cerrar: [];
}>();

const claseAlerta = computed(() => {
    return `alert alert-${props.tipo} ${
        props.dismissible ? "alert-dismissible" : ""
    } fade show`;
});

const iconoAlerta = computed(() => {
    const iconos = {
        success: "bi-check-circle-fill",
        danger: "bi-exclamation-triangle-fill",
        warning: "bi-exclamation-circle-fill",
        info: "bi-info-circle-fill",
    };
    return iconos[props.tipo];
});

const cerrar = () => {
    emit("cerrar");
};
</script>

<template>
    <Transition name="alerta">
        <div v-if="visible" :class="claseAlerta" role="alert">
            <div class="d-flex align-items-center">
                <i :class="iconoAlerta" class="me-2"></i>
                <div class="flex-grow-1">{{ mensaje }}</div>
                <button
                    v-if="dismissible"
                    type="button"
                    class="btn-close"
                    @click="cerrar"
                    aria-label="Cerrar"
                ></button>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.alerta-enter-active,
.alerta-leave-active {
    transition: all 0.3s ease;
}

.alerta-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.alerta-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.alert {
    margin-bottom: 1rem;
}
</style>
