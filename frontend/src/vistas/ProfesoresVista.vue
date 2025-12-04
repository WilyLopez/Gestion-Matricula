<!-- src/vistas/ProfesoresVista.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Profesor, ProfesorFormulario } from "@/tipos";
import { profesorServicio } from "@/servicios/profesorServicio";
import TablaProfesores from "@/components/profesores/TablaProfesores.vue";
import FormularioProfesor from "@/components/profesores/FormularioProfesor.vue";
import ModalConfirmacion from "@/components/comunes/ModalConfirmacion.vue";
import Paginacion from "@/components/comunes/Paginacion.vue";
import Cargando from "@/components/comunes/Cargando.vue";
import Alerta from "@/components/comunes/Alerta.vue";
import { useAlerta } from "@/composables/useAlerta";

const { alerta, mostrarAlerta, cerrarAlerta } = useAlerta();
const profesores = ref<Profesor[]>([]);
const cargando = ref(true);

// Filtros y Paginación
const busqueda = ref("");
const paginaActual = ref(1);
const limitePorPagina = ref(10);
const totalProfesores = ref(0);

const mostrarFormulario = ref(false);
const profesorParaEditar = ref<Profesor | null>(null);

const mostrarConfirmacion = ref(false);
const profesorParaEliminar = ref<Profesor | null>(null);

const mostrarDetalles = ref(false);
const profesorParaVer = ref<Profesor | null>(null);

const cargarProfesores = async () => {
    cargando.value = true;
    try {
        const opciones = {
            pagina: paginaActual.value,
            limite: limitePorPagina.value,
            busqueda: busqueda.value,
        };
        const respuesta = await profesorServicio.obtenerTodos(opciones);
        profesores.value = respuesta.registros;
        totalProfesores.value = respuesta.total;
    } catch (error: any) {
        mostrarAlerta("danger", `Error al cargar los profesores: ${error.message}`);
    } finally {
        cargando.value = false;
    }
};

let debounceTimer: number;
watch(busqueda, () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        paginaActual.value = 1;
        cargarProfesores();
    }, 500); // 500ms de retraso
});

watch(paginaActual, () => {
    cargarProfesores();
});

onMounted(cargarProfesores);

const abrirFormulario = (profesor: Profesor | null = null) => {
    profesorParaEditar.value = profesor;
    mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
    mostrarFormulario.value = false;
    profesorParaEditar.value = null;
};

const guardarProfesor = async (datos: ProfesorFormulario) => {
    try {
        if (profesorParaEditar.value) {
            await profesorServicio.actualizar(profesorParaEditar.value.id, datos);
            mostrarAlerta("success", "Profesor actualizado con éxito");
        } else {
            await profesorServicio.crear(datos);
            mostrarAlerta("success", "Profesor creado con éxito");
        }
        await cargarProfesores();
        cerrarFormulario();
    } catch (error: any) {
        const mensajeError = error.response?.data?.error || `Error al guardar el profesor: ${error.message}`;
        mostrarAlerta("danger", mensajeError);
    }
};

const preguntarEliminar = (profesor: Profesor) => {
    profesorParaEliminar.value = profesor;
    mostrarConfirmacion.value = true;
};

const cerrarConfirmacion = () => {
    mostrarConfirmacion.value = false;
    profesorParaEliminar.value = null;
};

const confirmarEliminacion = async () => {
    if (!profesorParaEliminar.value) return;
    try {
        await profesorServicio.eliminar(profesorParaEliminar.value.id);
        mostrarAlerta("success", "Profesor eliminado con éxito");
        await cargarProfesores();
        cerrarConfirmacion();
    } catch (error: any) {
        const mensajeError = error.response?.data?.error || `Error al eliminar el profesor: ${error.message}`;
        mostrarAlerta("danger", mensajeError);
        cerrarConfirmacion();
    }
};

const verDetalles = (profesor: Profesor) => {
    profesorParaVer.value = profesor;
    mostrarDetalles.value = true;
};

const cerrarDetalles = () => {
    mostrarDetalles.value = false;
    profesorParaVer.value = null;
};

</script>

<template>
    <div class="container-fluid py-4">
        <Alerta v-bind="alerta" @cerrar="cerrarAlerta" />

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h3 mb-0 text-gray-800">Gestión de Profesores</h1>
            <button @click="abrirFormulario(null)" class="btn btn-primary">
                <i class="bi bi-plus-circle me-1"></i>
                Añadir Profesor
            </button>
        </div>

        <div class="card shadow">
            <div class="card-header">
                <div class="row gy-3">
                    <div class="col-md-8">
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-search"></i></span>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Buscar por nombre, apellidos, DNI o email..."
                                v-model="busqueda"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <Cargando v-if="cargando" />
                <TablaProfesores
                    v-else
                    :profesores="profesores"
                    @ver="verDetalles"
                    @editar="abrirFormulario"
                    @eliminar="preguntarEliminar"
                />
            </div>
            <div class="card-footer d-flex justify-content-end">
                <Paginacion
                    :pagina-actual="paginaActual"
                    :total-items="totalProfesores"
                    :items-por-pagina="limitePorPagina"
                    @update:pagina-actual="paginaActual = $event"
                />
            </div>
        </div>

        <!-- Modal para Formulario -->
        <div v-if="mostrarFormulario" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ profesorParaEditar ? 'Editar Profesor' : 'Nuevo Profesor' }}
                        </h5>
                        <button type="button" class="btn-close" @click="cerrarFormulario"></button>
                    </div>
                    <div class="modal-body">
                        <FormularioProfesor
                            :profesor="profesorParaEditar"
                            @guardar="guardarProfesor"
                            @cancelar="cerrarFormulario"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="mostrarFormulario" class="modal-backdrop fade show"></div>

        <!-- Modal para Detalles -->
        <div v-if="mostrarDetalles && profesorParaVer" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalles del Profesor</h5>
                        <button type="button" class="btn-close" @click="cerrarDetalles"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <strong>Nombres:</strong>
                                <p>{{ profesorParaVer.nombres }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Apellidos:</strong>
                                <p>{{ profesorParaVer.apellidos }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>DNI:</strong>
                                <p>{{ profesorParaVer.dni }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Especialidad:</strong>
                                <p>{{ profesorParaVer.especialidad }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Teléfono:</strong>
                                <p>{{ profesorParaVer.telefono }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Email:</strong>
                                <p>{{ profesorParaVer.email }}</p>
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
            mensaje="¿Estás seguro de que quieres eliminar a este profesor? Esta acción no se puede deshacer."
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
