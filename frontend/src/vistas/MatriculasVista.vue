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
const mostrarConfirmacion = ref(false);
const matriculaParaEliminar = ref<Matricula | null>(null);

const mostrarDetalles = ref(false);
const matriculaParaVer = ref<Matricula | null>(null);

const mostrarModalEstado = ref(false);
const matriculaParaCambiarEstado = ref<Matricula | null>(null);
const nuevoEstado = ref("activa");
const estadosPosibles = ["activa", "retirado", "culminado"];

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

const abrirFormulario = () => {
    mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
    mostrarFormulario.value = false;
};

const guardarMatricula = async (datos: MatriculaFormulario) => {
    try {
        await matriculaServicio.crear(datos);
        mostrarAlerta("success", "Matrícula creada con éxito");
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
        const mensajeError = error.response?.data?.error || `Error al eliminar: ${error.message}`;
        mostrarAlerta("danger", mensajeError);
        cerrarConfirmacion();
    }
};

const verDetalles = (matricula: Matricula) => {
    matriculaParaVer.value = matricula;
    mostrarDetalles.value = true;
};

const cerrarDetalles = () => {
    mostrarDetalles.value = false;
    matriculaParaVer.value = null;
};

const cambiarEstado = (matricula: Matricula) => {
    matriculaParaCambiarEstado.value = matricula;
    nuevoEstado.value = matricula.estado;
    mostrarModalEstado.value = true;
};

const cerrarModalEstado = () => {
    mostrarModalEstado.value = false;
    matriculaParaCambiarEstado.value = null;
};

const guardarEstado = async () => {
    if (!matriculaParaCambiarEstado.value) return;
    try {
        await matriculaServicio.actualizarEstado(matriculaParaCambiarEstado.value.id, nuevoEstado.value);
        mostrarAlerta("success", "Estado de la matrícula actualizado con éxito");
        await cargarMatriculas();
        cerrarModalEstado();
    } catch (error: any) {
        const mensajeError = error.response?.data?.error || `Error al actualizar el estado: ${error.message}`;
        mostrarAlerta("danger", mensajeError);
    }
};

</script>

<template>
    <div class="container-fluid py-4">
        <Alerta v-bind="alerta" @cerrar="cerrarAlerta" />

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h3 mb-0 text-gray-800">Gestión de Matrículas</h1>
            <button @click="abrirFormulario" class="btn btn-primary">
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

        <!-- Modal para Formulario de Nueva Matrícula -->
        <div v-if="mostrarFormulario" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nueva Matrícula</h5>
                        <button type="button" class="btn-close" @click="cerrarFormulario"></button>
                    </div>
                    <div class="modal-body">
                        <FormularioMatricula @guardar="guardarMatricula" @cancelar="cerrarFormulario" />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="mostrarFormulario" class="modal-backdrop fade show"></div>

        <!-- Modal para Detalles -->
        <div v-if="mostrarDetalles && matriculaParaVer" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalles de la Matrícula</h5>
                        <button type="button" class="btn-close" @click="cerrarDetalles"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <strong>Estudiante:</strong>
                                <p>{{ matriculaParaVer.estudiante?.nombres }} {{ matriculaParaVer.estudiante?.apellidos }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Sección:</strong>
                                <p>{{ matriculaParaVer.seccion?.nombre }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Grado:</strong>
                                <p>{{ matriculaParaVer.seccion?.grado?.nombre }}</p>
                            </div>
                             <div class="col-md-6 mb-3">
                                <strong>Nivel:</strong>
                                <p>{{ matriculaParaVer.seccion?.grado?.nivel?.nombre }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Año Académico:</strong>
                                <p>{{ matriculaParaVer.anioAcademico?.anio }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Fecha de Matrícula:</strong>
                                <p>{{ new Date(matriculaParaVer.fechaMatricula).toLocaleDateString('es-ES') }}</p>
                            </div>
                             <div class="col-md-6 mb-3">
                                <strong>Estado:</strong>
                                <p class="text-capitalize">{{ matriculaParaVer.estado }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="cerrarDetalles">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="mostrarDetalles" class="modal-backdrop fade show"></div>

        <!-- Modal para Cambiar Estado -->
        <div v-if="mostrarModalEstado" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Cambiar Estado de Matrícula</h5>
                        <button type="button" class="btn-close" @click="cerrarModalEstado"></button>
                    </div>
                    <div class="modal-body">
                        <p>Seleccione el nuevo estado para la matrícula del estudiante <strong>{{ matriculaParaCambiarEstado?.estudiante?.nombres }} {{ matriculaParaCambiarEstado?.estudiante?.apellidos }}</strong>.</p>
                        <select class="form-select" v-model="nuevoEstado">
                            <option v-for="estado in estadosPosibles" :key="estado" :value="estado">{{ estado }}</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="cerrarModalEstado">Cancelar</button>
                        <button type="button" class="btn btn-primary" @click="guardarEstado">Guardar Estado</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="mostrarModalEstado" class="modal-backdrop fade show"></div>

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
.text-capitalize {
    text-transform: capitalize;
}
</style>
