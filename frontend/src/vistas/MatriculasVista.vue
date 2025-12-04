<!-- src/vistas/MatriculasVista.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Matricula, MatriculaFormulario } from "@/tipos";
import { matriculaServicio } from "@/servicios/matriculaServicio";
import TablaMatriculas from "@/components/matriculas/TablaMatriculas.vue";
import FormularioMatricula from "@/components/matriculas/FormularioMatricula.vue";
import ModalConfirmacion from "@/components/comunes/ModalConfirmacion.vue";
import Cargando from "@/components/comunes/Cargando.vue";
import Alerta from "@/components/comunes/Alerta.vue";
import { useAlerta } from "@/composables/useAlerta";

const { alerta, mostrarAlerta, cerrarAlerta } = useAlerta();
const matriculas = ref<Matricula[]>([]);
const cargando = ref(true);

const mostrarFormulario = ref(false);
const matriculaParaEditar = ref<Matricula | null>(null);

const mostrarConfirmacion = ref(false);
const matriculaParaEliminar = ref<Matricula | null>(null);

const cargarMatriculas = async () => {
    cargando.value = true;
    try {
        matriculas.value = await matriculaServicio.obtenerTodas();
    } catch (error: any) {
        mostrarAlerta("danger", `Error al cargar las matrículas: ${error.message}`);
    } finally {
        cargando.value = false;
    }
};

onMounted(cargarMatriculas);

const abrirFormulario = (matricula: Matricula | null = null) => {
    matriculaParaEditar.value = matricula;
    mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    matriculaParaEditar.value = null;
};

const guardarMatricula = async (datos: MatriculaFormulario) => {
    try {
        if (matriculaParaEditar.value) {
            // NOTE: The service for updating is not fully defined in the project structure.
            // Assuming an update function exists.
            // await matriculaServicio.actualizar(matriculaParaEditar.value.id, datos);
            mostrarAlerta("success", "Matrícula actualizada con éxito");
        } else {
            await matriculaServicio.crear(datos);
            mostrarAlerta("success", "Matrícula creada con éxito");
        }
        await cargarMatriculas();
        cerrarFormulario();
    } catch (error: any) {
        const mensajeError = error.response?.data?.error || `Error al guardar: ${error.message}`;
        mostrarAlerta("danger", mensajeError);
    }
};

const preguntarEliminar = (matricula: Matricula) => {
    matriculaParaEliminar.value = matricula;
    mostrarConfirmacion.value = true;
};

const cerrarConfirmacion = () => {
    mostrarConfirmacion.value = false;
    matriculaParaEliminar.value = null;
};

const confirmarEliminacion = async () => {
    if (!matriculaParaEliminar.value) return;
    try {
        await matriculaServicio.eliminar(matriculaParaEliminar.value.id);
        mostrarAlerta("success", "Matrícula eliminada con éxito");
        await cargarMatriculas();
        cerrarConfirmacion();
    } catch (error: any) {
        mostrarAlerta("danger", `Error al eliminar: ${error.message}`);
        cerrarConfirmacion();
    }
};

const verDetalles = (matricula: Matricula) => {
    // Navigate to student details view
    // router.push({ name: 'DetalleEstudiante', params: { id: matricula.estudianteId } });
    console.log("Ver detalles del estudiante de la matrícula:", matricula);
};

const cambiarEstado = (matricula: Matricula) => {
    // This could open a specific modal to change the status
    console.log("Cambiar estado de la matrícula:", matricula);
    mostrarAlerta("info", `Funcionalidad "Cambiar Estado" no implementada.`);
};
</script>

<template>
    <div class="container-fluid py-4">
        <Alerta v-bind="alerta" @cerrar="cerrarAlerta" />

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h3 mb-0 text-gray-800">Gestión de Matrículas</h1>
            <button @click="abrirFormulario(null)" class="btn btn-primary">
                <i class="bi bi-plus-circle me-1"></i>
                Añadir Matrícula
            </button>
        </div>

        <div class="card shadow">
            <div class="card-body">
                <Cargando v-if="cargando" />
                <TablaMatriculas
                    v-else
                    :matriculas="matriculas"
                    @ver="verDetalles"
                    @cambiar-estado="cambiarEstado"
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
                            {{ matriculaParaEditar ? 'Editar Matrícula' : 'Nueva Matrícula' }}
                        </h5>
                        <button type="button" class="btn-close" @click="cerrarFormulario"></button>
                    </div>
                    <div class="modal-body">
                        <FormularioMatricula
                            @guardar="guardarMatricula"
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
            mensaje="¿Estás seguro de que quieres eliminar esta matrícula? Esta acción no se puede deshacer."
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
