<!-- src/vistas/ProfesoresVista.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Profesor, ProfesorFormulario } from "@/tipos";
import { profesorServicio } from "@/servicios/profesorServicio";
import TablaProfesores from "@/components/profesores/TablaProfesores.vue";
import FormularioProfesor from "@/components/profesores/FormularioProfesor.vue";
import ModalConfirmacion from "@/components/comunes/ModalConfirmacion.vue";
import Cargando from "@/components/comunes/Cargando.vue";
import Alerta from "@/components/comunes/Alerta.vue";
import { useAlerta } from "@/composables/useAlerta";

const { alerta, mostrarAlerta, cerrarAlerta } = useAlerta();
const profesores = ref<Profesor[]>([]);
const cargando = ref(true);

const mostrarFormulario = ref(false);
const profesorParaEditar = ref<Profesor | null>(null);

const mostrarConfirmacion = ref(false);
const profesorParaEliminar = ref<Profesor | null>(null);

const cargarProfesores = async () => {
    cargando.value = true;
    try {
        profesores.value = await profesorServicio.obtenerTodos();
    } catch (error: any) {
        mostrarAlerta("danger", `Error al cargar los profesores: ${error.message}`);
    } finally {
        cargando.value = false;
    }
};

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
        mostrarAlerta("danger", `Error al eliminar el profesor: ${error.message}`);
        cerrarConfirmacion();
    }
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
            <div class="card-body">
                <Cargando v-if="cargando" />
                <TablaProfesores
                    v-else
                    :profesores="profesores"
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
