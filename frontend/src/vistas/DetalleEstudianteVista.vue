<!-- src/vistas/DetalleEstudianteVista.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { Estudiante } from "@/tipos";
import { estudianteServicio } from "@/servicios/estudianteServicio";
import Cargando from "@/components/comunes/Cargando.vue";
import Alerta from "@/components/comunes/Alerta.vue";
import { useAlerta } from "@/composables/useAlerta";

const route = useRoute();
const { alerta, mostrarAlerta, cerrarAlerta } = useAlerta();

const estudiante = ref<Estudiante | null>(null);
const cargando = ref(true);

const cargarEstudiante = async (id: number) => {
    cargando.value = true;
    try {
        estudiante.value = await estudianteServicio.obtenerPorId(id);
        if (!estudiante.value) {
            mostrarAlerta("danger", "Estudiante no encontrado.");
        }
    } catch (error: any) {
        mostrarAlerta("danger", `Error al cargar el estudiante: ${error.message}`);
    } finally {
        cargando.value = false;
    }
};

onMounted(() => {
    const id = parseInt(route.params.id as string);
    if (id) {
        cargarEstudiante(id);
    } else {
        mostrarAlerta("danger", "ID de estudiante no proporcionado.");
        cargando.value = false;
    }
});

watch(
    () => route.params.id,
    (newId) => {
        const id = parseInt(newId as string);
        if (id) {
            cargarEstudiante(id);
        } else {
            estudiante.value = null;
            mostrarAlerta("danger", "ID de estudiante no proporcionado o inválido.");
            cargando.value = false;
        }
    }
);
</script>

<template>
    <div class="container-fluid py-4">
        <Alerta v-bind="alerta" @cerrar="cerrarAlerta" />

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h3 mb-0 text-gray-800">Detalles del Estudiante</h1>
            <router-link :to="{ name: 'Estudiantes' }" class="btn btn-secondary">
                <i class="bi bi-arrow-left me-1"></i>
                Volver a Estudiantes
            </router-link>
        </div>

        <div class="card shadow">
            <div class="card-body">
                <Cargando v-if="cargando" />
                <div v-else-if="estudiante" class="row">
                    <div class="col-md-6 mb-3">
                        <strong>Nombres:</strong>
                        <p class="mb-0">{{ estudiante.nombres }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Apellidos:</strong>
                        <p class="mb-0">{{ estudiante.apellidos }}</p>
                    </div>
                    <div class="col-md-4 mb-3">
                        <strong>DNI:</strong>
                        <p class="mb-0">{{ estudiante.dni }}</p>
                    </div>
                    <div class="col-md-4 mb-3">
                        <strong>Fecha de Nacimiento:</strong>
                        <p class="mb-0">{{ new Date(estudiante.fechaNacimiento).toLocaleDateString() }}</p>
                    </div>
                    <div class="col-md-4 mb-3">
                        <strong>Teléfono:</strong>
                        <p class="mb-0">{{ estudiante.telefono || 'N/A' }}</p>
                    </div>
                    <div class="col-12 mb-3">
                        <strong>Dirección:</strong>
                        <p class="mb-0">{{ estudiante.direccion || 'N/A' }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Fecha de Creación:</strong>
                        <p class="mb-0">{{ new Date(estudiante.creadoEn).toLocaleString() }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Última Actualización:</strong>
                        <p class="mb-0">{{ new Date(estudiante.actualizadoEn).toLocaleString() }}</p>
                    </div>
                </div>
                <div v-else class="alert alert-info">
                    No se pudo cargar la información del estudiante.
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container-fluid {
    max-width: 1400px;
}
</style>
