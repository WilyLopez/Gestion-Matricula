<!-- src/vistas/SeccionesVista.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Seccion, SeccionFormulario } from "@/tipos";
import { seccionServicio } from "@/servicios/seccionServicio";
import TablaSecciones from "@/components/secciones/TablaSecciones.vue";
import FormularioSeccion from "@/components/secciones/FormularioSeccion.vue";
import ModalConfirmacion from "@/components/comunes/ModalConfirmacion.vue";
import Cargando from "@/components/comunes/Cargando.vue";
import Alerta from "@/components/comunes/Alerta.vue";
import { useAlerta } from "@/composables/useAlerta";

const { alerta, mostrarAlerta, cerrarAlerta } = useAlerta();
const secciones = ref<Seccion[]>([]);
const cargando = ref(true);

const mostrarFormulario = ref(false);
const seccionParaEditar = ref<Seccion | null>(null);

const mostrarConfirmacion = ref(false);
const seccionParaEliminar = ref<Seccion | null>(null);

const mostrarDetalles = ref(false);
const seccionParaVer = ref<Seccion | null>(null);

const cargarSecciones = async () => {
    cargando.value = true;
    try {
        secciones.value = await seccionServicio.obtenerTodas();
    } catch (error: any) {
        mostrarAlerta("danger", `Error al cargar las secciones: ${error.message}`);
    } finally {
        cargando.value = false;
    }
};

onMounted(cargarSecciones);

const abrirFormulario = (seccion: Seccion | null = null) => {
    seccionParaEditar.value = seccion;
    mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    seccionParaEditar.value = null;
};

const guardarSeccion = async (datos: SeccionFormulario) => {
    try {
        if (seccionParaEditar.value) {
            await seccionServicio.actualizar(seccionParaEditar.value.id, datos);
            mostrarAlerta("success", "Sección actualizada con éxito");
        } else {
            await seccionServicio.crear(datos);
            mostrarAlerta("success", "Sección creada con éxito");
        }
        await cargarSecciones();
        cerrarFormulario();
    } catch (error: any) {
        const mensajeError = error.response?.data?.error || `Error al guardar la sección: ${error.message}`;
        mostrarAlerta("danger", mensajeError);
    }
};

const preguntarEliminar = (seccion: Seccion) => {
    seccionParaEliminar.value = seccion;
    mostrarConfirmacion.value = true;
};

const cerrarConfirmacion = () => {
    mostrarConfirmacion.value = false;
    seccionParaEliminar.value = null;
};

const confirmarEliminacion = async () => {
    if (!seccionParaEliminar.value) return;
    try {
        await seccionServicio.eliminar(seccionParaEliminar.value.id);
        mostrarAlerta("success", "Sección eliminada con éxito");
        await cargarSecciones();
        cerrarConfirmacion();
    } catch (error: any) {
        const mensajeError = error.response?.data?.error || `Error al eliminar la sección: ${error.message}`;
        mostrarAlerta("danger", mensajeError);
        cerrarConfirmacion();
    }
};

const verDetalles = (seccion: Seccion) => {
    seccionParaVer.value = seccion;
    mostrarDetalles.value = true;
};

const cerrarDetalles = () => {
    mostrarDetalles.value = false;
    seccionParaVer.value = null;
};

</script>

<template>
    <div class="container-fluid py-4">
        <Alerta v-bind="alerta" @cerrar="cerrarAlerta" />

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h3 mb-0 text-gray-800">Gestión de Secciones</h1>
            <button @click="abrirFormulario(null)" class="btn btn-primary">
                <i class="bi bi-plus-circle me-1"></i>
                Añadir Sección
            </button>
        </div>

        <div class="card shadow">
            <div class="card-body">
                <Cargando v-if="cargando" />
                <TablaSecciones
                    v-else
                    :secciones="secciones"
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
                            {{ seccionParaEditar ? 'Editar Sección' : 'Nueva Sección' }}
                        </h5>
                        <button type="button" class="btn-close" @click="cerrarFormulario"></button>
                    </div>
                    <div class="modal-body">
                        <FormularioSeccion
                            :seccion="seccionParaEditar"
                            @guardar="guardarSeccion"
                            @cancelar="cerrarFormulario"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="mostrarFormulario" class="modal-backdrop fade show"></div>

        <!-- Modal para Detalles -->
        <div v-if="mostrarDetalles && seccionParaVer" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalles de la Sección</h5>
                        <button type="button" class="btn-close" @click="cerrarDetalles"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <strong>Nivel:</strong>
                                <p>{{ seccionParaVer.grado?.nivel?.nombre }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Grado:</strong>
                                <p>{{ seccionParaVer.grado?.nombre }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Nombre:</strong>
                                <p>{{ seccionParaVer.nombre }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Turno:</strong>
                                <p class="text-capitalize">{{ seccionParaVer.turno }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Capacidad Máxima:</strong>
                                <p>{{ seccionParaVer.capacidadMaxima }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Profesor Tutor:</strong>
                                <p v-if="seccionParaVer.profesor">{{ seccionParaVer.profesor.nombres }} {{ seccionParaVer.profesor.apellidos }}</p>
                                <p v-else>Sin asignar</p>
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

        <!-- Modal de Confirmación -->
        <ModalConfirmacion
            :visible="mostrarConfirmacion"
            titulo="Confirmar Eliminación"
            mensaje="¿Estás seguro de que quieres eliminar esta sección? Esta acción no se puede deshacer."
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
