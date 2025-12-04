<!-- src/componentes/comunes/Cargando.vue -->
<script setup lang="ts">
interface Props {
    texto?: string;
    pequeno?: boolean;
}

withDefaults(defineProps<Props>(), {
    texto: "Cargando...",
    pequeno: false,
});
</script>

<template>
    <div class="contenedor-cargando" :class="{ pequeno: pequeno }">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{ texto }}</span>
        </div>
        <p class="mt-2 mb-0">{{ texto }}</p>
    </div>
</template>

<style scoped>
.contenedor-cargando {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.contenedor-cargando.pequeno {
    padding: 1rem;
}

.contenedor-cargando.pequeno .spinner-border {
    width: 1.5rem;
    height: 1.5rem;
}

.contenedor-cargando.pequeno p {
    font-size: 0.875rem;
}
</style>
