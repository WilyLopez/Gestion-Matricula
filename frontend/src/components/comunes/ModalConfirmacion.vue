<!-- src/components/comunes/ModalConfirmacion.vue -->
<script setup lang="ts">
interface Props {
    visible: boolean;
    titulo: string;
    mensaje: string;
    tipo?: "danger" | "warning" | "info";
    textoConfirmar?: string;
    textoCancelar?: string;
}

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    tipo: "danger",
    textoConfirmar: "Confirmar",
    textoCancelar: "Cancelar",
});

const emit = defineEmits<{
    confirmar: [];
    cancelar: [];
}>();

const confirmar = () => {
    emit("confirmar");
};

const cancelar = () => {
    emit("cancelar");
};
</script>

<template>
    <div v-if="visible">
        <div class="modal fade show d-block" tabindex="-1" @click.self="cancelar" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" :class="`border-${tipo}`">
                        <h5 class="modal-title">
                            <i
                                class="bi"
                                :class="{
                                    'bi-exclamation-triangle-fill text-danger': tipo === 'danger',
                                    'bi-exclamation-circle-fill text-warning': tipo === 'warning',
                                    'bi-info-circle-fill text-info': tipo === 'info',
                                }"
                            ></i>
                            {{ titulo }}
                        </h5>
                        <button type="button" class="btn-close" @click="cancelar"></button>
                    </div>
                    <div class="modal-body">
                        <p class="mb-0">{{ mensaje }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="cancelar">
                            {{ textoCancelar }}
                        </button>
                        <button type="button" :class="`btn btn-${tipo}`" @click="confirmar">
                            {{ textoConfirmar }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    </div>
</template>
