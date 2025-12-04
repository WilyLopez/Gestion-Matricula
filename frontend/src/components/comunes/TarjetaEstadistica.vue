<!-- src/componentes/comunes/TarjetaEstadistica.vue -->
<script setup lang="ts">
interface Props {
    titulo: string;
    valor: number | string;
    icono: string;
    color?: string;
    subtitulo?: string;
}

withDefaults(defineProps<Props>(), {
    color: "primary",
});
</script>

<template>
    <div class="card tarjeta-estadistica h-100 tarjeta-sombra">
        <div class="card-body">
            <div class="d-flex align-items-center">
                <div :class="`icono-contenedor bg-${color} bg-opacity-10`">
                    <i :class="`bi ${icono} text-${color}`"></i>
                </div>
                <div class="ms-3 flex-grow-1">
                    <h6 class="text-muted mb-1">{{ titulo }}</h6>
                    <h3 class="mb-0">{{ valor }}</h3>
                    <small v-if="subtitulo" class="text-muted">{{
                        subtitulo
                    }}</small>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tarjeta-estadistica {
    border: none;
    border-radius: 10px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tarjeta-estadistica:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.icono-contenedor {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icono-contenedor i {
    font-size: 1.5rem;
}
</style>
