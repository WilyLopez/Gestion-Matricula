<!-- src/vistas/EstudiantesVista.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Estudiante, EstudianteFormulario } from "@/tipos";
import { estudianteServicio } from "@/servicios/estudianteServicio";
import TablaEstudiantes from "@/components/estudiantes/TablaEstudiantes.vue";
import FormularioEstudiante from "@/components/estudiantes/FormularioEstudiante.vue";
import ModalConfirmacion from "@/components/comunes/ModalConfirmacion.vue";
import Cargando from "@/components/comunes/Cargando.vue";
import Alerta from "@/components/comunes/Alerta.vue";
import { useAlerta } from "@/composables/useAlerta";
import { useRouter } from 'vue-router';

const { alerta, mostrarAlerta, cerrarAlerta } = useAlerta();
const estudiantes = ref<Estudiante[]>([]);
const cargando = ref(true);
const router = useRouter();

const mostrarFormulario = ref(false);
const estudianteParaEditar = ref<Estudiante | null>(null);

const mostrarConfirmacion = ref(false);
const estudianteParaEliminar = ref<Estudiante | null>(null);

const cargarEstudiantes = async () => {
    cargando.value = true;
    try {
        estudiantes.value = await estudianteServicio.obtenerTodos();
    } catch (error: any) {
        mostrarAlerta("danger", `Error al cargar los estudiantes: ${error.message}`);
    } finally {
        cargando.value = false;
    }
};

onMounted(cargarEstudiantes);

const abrirFormulario = (estudiante: Estudiante | null = null) => {
    estudianteParaEditar.value = estudiante;
    mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    estudianteParaEditar.value = null;
};

const guardarEstudiante = async (datos: EstudianteFormulario) => {
    try {
        if (estudianteParaEditar.value) {
            await estudianteServicio.actualizar(estudianteParaEditar.value.id, datos);
            mostrarAlerta("success", "Estudiante actualizado con éxito");
        } else {
            await estudianteServicio.crear(datos);
            mostrarAlerta("success", "Estudiante creado con éxito");
        }
        await cargarEstudiantes();
        cerrarFormulario();
    } catch (error: any) {
        const mensajeError = error.response?.data?.error || `Error al guardar el estudiante: ${error.message}`;
        mostrarAlerta("danger", mensajeError);
    }
};

const preguntarEliminar = (estudiante: Estudiante) => {
    estudianteParaEliminar.value = estudiante;
    mostrarConfirmacion.value = true;
};

const cerrarConfirmacion = () => {
    mostrarConfirmacion.value = false;
    estudianteParaEliminar.value = null;
};

const confirmarEliminacion = async () => {
    if (!estudianteParaEliminar.value) return;
    try {
        await estudianteServicio.eliminar(estudianteParaEliminar.value.id);
        mostrarAlerta("success", "Estudiante eliminado con éxito");
        await cargarEstudiantes();
        cerrarConfirmacion();
    } catch (error: any) {
        mostrarAlerta("danger", `Error al eliminar el estudiante: ${error.message}`);
        cerrarConfirmacion();
    }
};

const verDetalles = (estudiante: Estudiante) => {
    router.push({ name: 'DetalleEstudiante', params: { id: estudiante.id } });
};

</script>

<template>
    <div class="container-fluid py-4">
        <Alerta v-bind="alerta" @cerrar="cerrarAlerta" />

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h3 mb-0 text-gray-800">Gestión de Estudiantes</h1>
            <button @click="abrirFormulario(null)" class="btn btn-primary">
                <i class="bi bi-plus-circle me-1"></i>
                Añadir Estudiante
            </button>
        </div>

        <div class="card shadow">
            <div class="card-body">
                <Cargando v-if="cargando" />
                <TablaEstudiantes
                    v-else
                    :estudiantes="estudiantes"
                    @ver="verDetalles"
                    @editar="abrirFormulario"
                    @eliminar="preguntarEliminar"
                />
            </div>
        </div>

        <!-- Modal para Formulario -->
        <div v-if="mostrarFormulario" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ estudianteParaEditar ? 'Editar Estudiante' : 'Nuevo Estudiante' }}
                        </h5>
                        <button type="button" class="btn-close" @click="cerrarFormulario"></button>
                    </div>
                    <div class="modal-body">
                        <FormularioEstudiante
                            :estudiante="estudianteParaEditar"
                            @guardar="guardarEstudiante"
                            @cancelar="cerrarFormulario"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="mostrarFormulario" class="modal-backdrop fade show"></div>

        <!-- Modal de Confirmación -->
        <ModalConfirmacion
            :visible="mostrarConfirmacion"
            titulo="Confirmar Eliminación"
            mensaje="¿Estás seguro de que quieres eliminar a este estudiante? Esta acción no se puede deshacer."
            @confirmar="confirmarEliminacion"
            @cancelar="cerrarConfirmacion"
        />
    </div>
</template>

<style scoped>
.container-fluid {
    max-width: 1400px;
}
</style>
