<!-- src/vistas/EstudiantesVista.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Estudiante, EstudianteFormulario } from "@/tipos";
import { estudianteServicio } from "@/servicios/estudianteServicio";
import TablaEstudiantes from "@/components/estudiantes/TablaEstudiantes.vue";
import FormularioEstudiante from "@/components/estudiantes/FormularioEstudiante.vue";
import ModalConfirmacion from "@/components/comunes/ModalConfirmacion.vue";
import Paginacion from "@/components/comunes/Paginacion.vue";
import Cargando from "@/components/comunes/Cargando.vue";
import Alerta from "@/components/comunes/Alerta.vue";
import { useAlerta } from "@/composables/useAlerta";
import { useRouter } from "vue-router";

const { alerta, mostrarAlerta, cerrarAlerta } = useAlerta();
const estudiantes = ref<Estudiante[]>([]);
const cargando = ref(true);
const router = useRouter();

// Filtros y Paginación
const busqueda = ref("");
const estadoFiltro = ref<"matriculado" | "sin-matricula" | "">("");
const paginaActual = ref(1);
const limitePorPagina = ref(10);
const totalEstudiantes = ref(0);

const mostrarFormulario = ref(false);
const estudianteParaEditar = ref<Estudiante | null>(null);

const mostrarConfirmacion = ref(false);
const estudianteParaEliminar = ref<Estudiante | null>(null);

const mostrarDetalles = ref(false);
const estudianteParaVer = ref<Estudiante | null>(null);

const cargarEstudiantes = async () => {
    cargando.value = true;
    try {
        const opciones = {
            pagina: paginaActual.value,
            limite: limitePorPagina.value,
            busqueda: busqueda.value,
            estado: estadoFiltro.value,
        };
        const respuesta = await estudianteServicio.obtenerTodos(opciones);
        estudiantes.value = respuesta.registros;
        totalEstudiantes.value = respuesta.total;
    } catch (error: any) {
        mostrarAlerta(
            "danger",
            `Error al cargar los estudiantes: ${error.message}`
        );
    } finally {
        cargando.value = false;
    }
};

let debounceTimer: number;
watch(busqueda, () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        paginaActual.value = 1;
        cargarEstudiantes();
    }, 500); // 500ms de retraso
});

watch([estadoFiltro, paginaActual], () => {
    if (paginaActual.value) {
        cargarEstudiantes();
    } else {
        paginaActual.value = 1;
    }
});

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
            await estudianteServicio.actualizar(
                estudianteParaEditar.value.id,
                datos
            );
            mostrarAlerta("success", "Estudiante actualizado con éxito");
        } else {
            await estudianteServicio.crear(datos);
            mostrarAlerta("success", "Estudiante creado con éxito");
        }
        await cargarEstudiantes();
        cerrarFormulario();
    } catch (error: any) {
        const mensajeError =
            error.response?.data?.error ||
            `Error al guardar el estudiante: ${error.message}`;
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
        const mensajeError =
            error.response?.data?.error ||
            `Error al eliminar el estudiante: ${error.message}`;
        mostrarAlerta("danger", mensajeError);
        cerrarConfirmacion();
    }
};

const verDetalles = (estudiante: Estudiante) => {
    estudianteParaVer.value = estudiante;
    mostrarDetalles.value = true;
};

const cerrarDetalles = () => {
    mostrarDetalles.value = false;
    estudianteParaVer.value = null;
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
            <div class="card-header">
                <div class="row gy-3">
                    <div class="col-md-6">
                        <div class="input-group">
                            <span class="input-group-text"
                                ><i class="bi bi-search"></i
                            ></span>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Buscar por nombre, apellidos o DNI..."
                                v-model="busqueda"
                            />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <select class="form-select" v-model="estadoFiltro">
                            <option value="">Todos los estados</option>
                            <option value="matriculado">Matriculado</option>
                            <option value="sin-matricula">Sin Matrícula</option>
                        </select>
                    </div>
                </div>
            </div>
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
            <div class="card-footer d-flex justify-content-end">
                <div class="card-footer d-flex justify-content-end">
                    <Paginacion
                        :pagina-actual="paginaActual"
                        :total-paginas="
                            Math.ceil(totalEstudiantes / limitePorPagina)
                        "
                        @cambiar-pagina="paginaActual = $event"
                    />
                </div>
            </div>
        </div>

        <!-- Modal para Formulario -->
        <div
            v-if="mostrarFormulario"
            class="modal fade show d-block"
            tabindex="-1"
            style="background-color: rgba(0, 0, 0, 0.5)"
        >
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{
                                estudianteParaEditar
                                    ? "Editar Estudiante"
                                    : "Nuevo Estudiante"
                            }}
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="cerrarFormulario"
                        ></button>
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

        <!-- Modal para Detalles -->
        <div
            v-if="mostrarDetalles && estudianteParaVer"
            class="modal fade show d-block"
            tabindex="-1"
            style="background-color: rgba(0, 0, 0, 0.5)"
        >
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalles del Estudiante</h5>
                        <button
                            type="button"
                            class="btn-close"
                            @click="cerrarDetalles"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <strong>Nombres:</strong>
                                <p>{{ estudianteParaVer.nombres }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Apellidos:</strong>
                                <p>{{ estudianteParaVer.apellidos }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>DNI:</strong>
                                <p>{{ estudianteParaVer.dni }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Fecha de Nacimiento:</strong>
                                <p>
                                    {{
                                        new Date(
                                            estudianteParaVer.fechaNacimiento
                                        ).toLocaleDateString("es-ES")
                                    }}
                                </p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Teléfono:</strong>
                                <p>{{ estudianteParaVer.telefono }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Dirección:</strong>
                                <p>{{ estudianteParaVer.direccion }}</p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Fecha de Creación:</strong>
                                <p>
                                    {{
                                        new Date(
                                            estudianteParaVer.creadoEn
                                        ).toLocaleDateString("es-ES")
                                    }}
                                </p>
                            </div>
                            <div class="col-md-6 mb-3">
                                <strong>Última Actualización:</strong>
                                <p>
                                    {{
                                        new Date(
                                            estudianteParaVer.actualizadoEn
                                        ).toLocaleDateString("es-ES")
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click="cerrarDetalles"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="mostrarDetalles" class="modal-backdrop fade show"></div>

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
