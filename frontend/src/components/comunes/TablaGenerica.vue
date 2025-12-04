<!-- src/componentes/comunes/TablaGenerica.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
interface Columna {
    clave: string;
    etiqueta: string;
    ordenable?: boolean;
    ancho?: string;
}

interface Props {
    columnas: Columna[];
    datos: T[];
    cargando?: boolean;
    mensajeVacio?: string;
}

withDefaults(defineProps<Props>(), {
    cargando: false,
    mensajeVacio: "No hay datos disponibles",
});

const emit = defineEmits<{
    accion: [accion: string, item: T];
}>();

const emitirAccion = (accion: string, item: T) => {
    emit("accion", accion, item);
};
</script>

<template>
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th
                        v-for="columna in columnas"
                        :key="columna.clave"
                        :style="{ width: columna.ancho }"
                    >
                        {{ columna.etiqueta }}
                    </th>
                    <th style="width: 120px">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="cargando">
                    <td :colspan="columnas.length + 1" class="text-center py-4">
                        <div
                            class="spinner-border spinner-border-sm text-primary"
                            role="status"
                        >
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                        <span class="ms-2">Cargando datos...</span>
                    </td>
                </tr>
                <tr v-else-if="datos.length === 0">
                    <td
                        :colspan="columnas.length + 1"
                        class="text-center text-muted py-4"
                    >
                        <i class="bi bi-inbox fs-1"></i>
                        <p class="mb-0 mt-2">{{ mensajeVacio }}</p>
                    </td>
                </tr>
                <tr v-else v-for="(item, index) in datos" :key="index">
                    <td v-for="columna in columnas" :key="columna.clave">
                        <slot :name="`columna-${columna.clave}`" :item="item">
                            {{ item[columna.clave] }}
                        </slot>
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm" role="group">
                            <button
                                type="button"
                                class="btn btn-outline-primary"
                                @click="emitirAccion('ver', item)"
                                title="Ver"
                            >
                                <i class="bi bi-eye"></i>
                            </button>
                            <button
                                type="button"
                                class="btn btn-outline-success"
                                @click="emitirAccion('editar', item)"
                                title="Editar"
                            >
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button
                                type="button"
                                class="btn btn-outline-danger"
                                @click="emitirAccion('eliminar', item)"
                                title="Eliminar"
                            >
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.table {
    margin-bottom: 0;
}

.btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
}
</style>
