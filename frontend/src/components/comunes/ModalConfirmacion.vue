<!-- src/componentes/comunes/ModalConfirmacion.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
    visible: boolean;
    titulo: string;
    mensaje: string;
    tipo?: "danger" | "warning" | "info";
    textoConfirmar?: string;
    textoCancelar?: string;
}

const props = withDefaults(defineProps<Props>(), {
    tipo: "danger",
    textoConfirmar: "Confirmar",
    textoCancelar: "Cancelar",
});

const emit = defineEmits<{
    confirmar: [];
    cancelar: [];
}>();

const mostrarModal = ref(false);

watch(
    () => props.visible,
    (nuevo) => {
        mostrarModal.value = nuevo;
    }
);

const confirmar = () => {
    emit("confirmar");
    mostrarModal.value = false;
};

const cancelar = () => {
    emit("cancelar");
    mostrarModal.value = false;
};
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="mostrarModal"
                class="modal-overlay"
                @click.self="cancelar"
            >
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header" :class="`border-${tipo}`">
                            <h5 class="modal-title">
                                <i
                                    class="bi"
                                    :class="{
                                        'bi-exclamation-triangle-fill text-danger':
                                            tipo === 'danger',
                                        'bi-exclamation-circle-fill text-warning':
                                            tipo === 'warning',
                                        'bi-info-circle-fill text-info':
                                            tipo === 'info',
                                    }"
                                ></i>
                                {{ titulo }}
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                @click="cancelar"
                            ></button>
                        </div>
                        <div class="modal-body">
                            <p class="mb-0">{{ mensaje }}</p>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                @click="cancelar"
                            >
                                {{ textoCancelar }}
                            </button>
                            <button
                                type="button"
                                :class="`btn btn-${tipo}`"
                                @click="confirmar"
                            >
                                {{ textoConfirmar }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
    transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
    transform: scale(0.9);
}
</style>
