<!-- src/componentes/matriculas/FormularioMatricula.vue -->
<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue";
import {
    MatriculaFormulario,
    Estudiante,
    Nivel,
    Grado,
    Seccion,
    AnioAcademico,
    Matricula,
} from "@/tipos";
import { useValidacion, CampoValidacion } from "@/composables/useValidacion";
import { useValidacionMatricula } from "@/composables/useValidacionMatricula";
import { estudianteServicio } from "@/servicios/estudianteServicio";
import { nivelServicio } from "@/servicios/nivelServicio";
import { gradoServicio } from "@/servicios/gradoServicio";
import { seccionServicio } from "@/servicios/seccionServicio";
import { anioAcademicoServicio } from "@/servicios/anioAcademicoServicio";
import { matriculaServicio } from "@/servicios/matriculaServicio";
import Alerta from "@/components/comunes/Alerta.vue";

const emit = defineEmits<{
    guardar: [datos: MatriculaFormulario];
    cancelar: [];
}>();

const { validarCampo, validarFormulario } = useValidacion();
const { validarMatricula } = useValidacionMatricula();

const estudiantes = ref<Estudiante[]>([]);
const niveles = ref<Nivel[]>([]);
const grados = ref<Grado[]>([]);
const secciones = ref<Seccion[]>([]);
const anioAcademico = ref<AnioAcademico | null>(null);
const matriculasExistentes = ref<Matricula[]>([]);

const nivelSeleccionado = ref<number | null>(null);
const gradoSeleccionado = ref<number | null>(null);
const cargandoDatos = ref(false);
const busquedaEstudiante = ref("");
const cargandoEstudiantes = ref(false);

const erroresValidacion = ref<string[]>([]);
const advertenciasValidacion = ref<string[]>([]);
const mostrarErrores = ref(false);
const mostrarAdvertencias = ref(false);

const formulario = reactive<MatriculaFormulario>({
    estudianteId: 0,
    seccionId: 0,
    anioAcademicoId: 0,
});

const campos = reactive<Record<string, CampoValidacion>>({
    estudianteId: {
        valor: 0,
        reglas: { requerido: true, numero: true, min: 1 },
        tocado: false,
        error: "",
    },
    seccionId: {
        valor: 0,
        reglas: { requerido: true, numero: true, min: 1 },
        tocado: false,
        error: "",
    },
});

const estudianteSeleccionado = computed(() => {
    return (
        estudiantes.value.find((e) => e.id === formulario.estudianteId) || null
    );
});

const seccionSeleccionada = computed(() => {
    return secciones.value.find((s) => s.id === formulario.seccionId) || null;
});

const seccionesFiltradas = computed(() => {
    return secciones.value.filter((seccion) => {
        const matriculas =
            seccion.matriculas?.filter((m) => m.estado === "activa").length ||
            0;
        return matriculas < seccion.capacidadMaxima;
    });
});

onMounted(async () => {
    await cargarDatos();
});

// Watch para buscar estudiantes cuando cambia el término de búsqueda
watch(busquedaEstudiante, async (nuevoValor) => {
    await buscarEstudiantes(nuevoValor);
});

watch([estudianteSeleccionado, seccionSeleccionada], () => {
    if (formulario.estudianteId && formulario.seccionId) {
        validarFormularioCompleto();
    }
});

const cargarDatos = async () => {
    cargandoDatos.value = true;
    try {
        const [estudiantesData, nivelesData, anioData, matriculasData] =
            await Promise.all([
                estudianteServicio.obtenerTodos({
                    limite: 100,
                    estado: "sin-matricula",
                }),
                nivelServicio.obtenerTodos(),
                anioAcademicoServicio.obtenerActivo(),
                matriculaServicio.obtenerTodas(),
            ]);

        // Acceder correctamente a la propiedad 'registros' del objeto Paginated
        estudiantes.value = estudiantesData.registros;
        niveles.value = nivelesData;
        anioAcademico.value = anioData;
        matriculasExistentes.value = matriculasData;

        if (anioAcademico.value) {
            formulario.anioAcademicoId = anioAcademico.value.id;
        }
    } catch (error: any) {
        console.error("Error al cargar datos:", error);
        erroresValidacion.value = [
            error.message || "Error al cargar datos iniciales",
        ];
        mostrarErrores.value = true;
    } finally {
        cargandoDatos.value = false;
    }
};

const buscarEstudiantes = async (termino: string) => {
    cargandoEstudiantes.value = true;
    try {
        const resultado = await estudianteServicio.obtenerTodos({
            limite: 100,
            busqueda: termino.trim() || undefined,
            estado: "sin-matricula",
        });
        estudiantes.value = resultado.registros;
    } catch (error) {
        console.error("Error al buscar estudiantes:", error);
    } finally {
        cargandoEstudiantes.value = false;
    }
};

const cargarGradosPorNivel = async (nivelId: number) => {
    try {
        grados.value = await gradoServicio.obtenerPorNivel(nivelId);
    } catch (error) {
        console.error("Error al cargar grados:", error);
        grados.value = [];
    }
};

const cargarSeccionesPorGrado = async (gradoId: number) => {
    try {
        secciones.value = await seccionServicio.obtenerPorGrado(gradoId);
    } catch (error) {
        console.error("Error al cargar secciones:", error);
        secciones.value = [];
    }
};

const manejarCambioNivel = async (evento: Event) => {
    const nivelId = parseInt((evento.target as HTMLSelectElement).value);
    nivelSeleccionado.value = nivelId;
    gradoSeleccionado.value = null;
    formulario.seccionId = 0;
    grados.value = [];
    secciones.value = [];

    if (nivelId) {
        await cargarGradosPorNivel(nivelId);
    }
};

const manejarCambioGrado = async (evento: Event) => {
    const gradoId = parseInt((evento.target as HTMLSelectElement).value);
    gradoSeleccionado.value = gradoId;
    formulario.seccionId = 0;
    secciones.value = [];

    if (gradoId) {
        await cargarSeccionesPorGrado(gradoId);
    }
};

const actualizarCampo = (
    nombreCampo: keyof MatriculaFormulario,
    valor: any
) => {
    formulario[nombreCampo] = valor as never;
    campos[nombreCampo].valor = valor;
    if (campos[nombreCampo].tocado) {
        validarCampo(campos[nombreCampo]);
    }
};

const marcarTocado = (nombreCampo: string) => {
    campos[nombreCampo].tocado = true;
    validarCampo(campos[nombreCampo]);
};

const validarFormularioCompleto = () => {
    const resultado = validarMatricula(
        estudianteSeleccionado.value,
        seccionSeleccionada.value,
        anioAcademico.value,
        matriculasExistentes.value
    );

    erroresValidacion.value = resultado.errores;
    advertenciasValidacion.value = resultado.advertencias;
    mostrarErrores.value = resultado.errores.length > 0;
    mostrarAdvertencias.value = resultado.advertencias.length > 0;

    return resultado.valido;
};

const manejarEnvio = () => {
    if (validarFormulario(campos) && validarFormularioCompleto()) {
        emit("guardar", { ...formulario });
    }
};

const manejarCancelar = () => {
    emit("cancelar");
};

const cerrarErrores = () => {
    mostrarErrores.value = false;
};

const cerrarAdvertencias = () => {
    mostrarAdvertencias.value = false;
};

const obtenerInfoSeccion = (seccion: Seccion) => {
    const matriculas =
        seccion.matriculas?.filter((m) => m.estado === "activa").length || 0;
    const disponibles = seccion.capacidadMaxima - matriculas;
    return `${seccion.grado?.nivel?.nombre} - ${seccion.grado?.nombre} - Sección ${seccion.nombre} (${disponibles} cupos)`;
};
</script>

<template>
    <div>
        <Alerta
            v-if="mostrarErrores"
            tipo="danger"
            :mensaje="erroresValidacion.join('. ')"
            :visible="mostrarErrores"
            @cerrar="cerrarErrores"
        />

        <Alerta
            v-if="mostrarAdvertencias"
            tipo="warning"
            :mensaje="advertenciasValidacion.join('. ')"
            :visible="mostrarAdvertencias"
            @cerrar="cerrarAdvertencias"
        />

        <form @submit.prevent="manejarEnvio">
            <div class="row g-3">
                <div class="col-12">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        <strong>Año Académico:</strong>
                        {{ anioAcademico?.anio || "No disponible" }}
                    </div>
                </div>

                <div class="col-12">
                    <label for="busquedaEstudiante" class="form-label">
                        Buscar Estudiante <span class="text-danger">*</span>
                    </label>
                    <div class="input-group mb-2">
                        <input
                            type="text"
                            class="form-control"
                            id="busquedaEstudiante"
                            v-model="busquedaEstudiante"
                            placeholder="Buscar por nombre, apellidos o DNI..."
                        />
                        <span
                            v-if="cargandoEstudiantes"
                            class="input-group-text"
                        >
                            <span
                                class="spinner-border spinner-border-sm"
                                role="status"
                            ></span>
                        </span>
                    </div>
                    <select
                        class="form-select"
                        :class="{
                            'is-invalid':
                                campos.estudianteId.tocado &&
                                campos.estudianteId.error,
                        }"
                        :value="formulario.estudianteId"
                        @change="
                            actualizarCampo(
                                'estudianteId',
                                parseInt(
                                    ($event.target as HTMLSelectElement).value
                                )
                            )
                        "
                        @blur="marcarTocado('estudianteId')"
                        :disabled="cargandoDatos || cargandoEstudiantes"
                    >
                        <option value="0">Seleccione un estudiante</option>
                        <option
                            v-for="estudiante in estudiantes"
                            :key="estudiante.id"
                            :value="estudiante.id"
                        >
                            {{ estudiante.nombres }}
                            {{ estudiante.apellidos }} - {{ estudiante.dni }}
                        </option>
                    </select>
                    <small
                        v-if="
                            estudiantes.length === 0 &&
                            !cargandoDatos &&
                            !cargandoEstudiantes
                        "
                        class="text-muted"
                    >
                        No se encontraron estudiantes disponibles para matrícula
                    </small>
                    <div
                        v-if="
                            campos.estudianteId.tocado &&
                            campos.estudianteId.error
                        "
                        class="invalid-feedback"
                    >
                        {{ campos.estudianteId.error }}
                    </div>
                </div>

                <div v-if="estudianteSeleccionado" class="col-12">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title mb-2">
                                <i class="bi bi-person-circle me-2"></i>
                                Información del Estudiante
                            </h6>
                            <div class="row g-2">
                                <div class="col-md-6">
                                    <small class="text-muted">DNI:</small>
                                    <p class="mb-0">
                                        {{ estudianteSeleccionado.dni }}
                                    </p>
                                </div>
                                <div class="col-md-6">
                                    <small class="text-muted">Teléfono:</small>
                                    <p class="mb-0">
                                        {{ estudianteSeleccionado.telefono }}
                                    </p>
                                </div>
                                <div class="col-12">
                                    <small class="text-muted">Dirección:</small>
                                    <p class="mb-0">
                                        {{ estudianteSeleccionado.direccion }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <label for="nivel" class="form-label">
                        Nivel <span class="text-danger">*</span>
                    </label>
                    <select
                        class="form-select"
                        id="nivel"
                        :value="nivelSeleccionado || ''"
                        @change="manejarCambioNivel"
                        :disabled="cargandoDatos"
                    >
                        <option value="">Seleccione un nivel</option>
                        <option
                            v-for="nivel in niveles"
                            :key="nivel.id"
                            :value="nivel.id"
                        >
                            {{ nivel.nombre }}
                        </option>
                    </select>
                </div>

                <div class="col-md-6">
                    <label for="grado" class="form-label">
                        Grado <span class="text-danger">*</span>
                    </label>
                    <select
                        class="form-select"
                        id="grado"
                        :value="gradoSeleccionado || ''"
                        @change="manejarCambioGrado"
                        :disabled="!nivelSeleccionado || grados.length === 0"
                    >
                        <option value="">Seleccione un grado</option>
                        <option
                            v-for="grado in grados"
                            :key="grado.id"
                            :value="grado.id"
                        >
                            {{ grado.nombre }}
                        </option>
                    </select>
                </div>

                <div class="col-12">
                    <label for="seccion" class="form-label">
                        Sección <span class="text-danger">*</span>
                    </label>
                    <select
                        class="form-select"
                        :class="{
                            'is-invalid':
                                campos.seccionId.tocado &&
                                campos.seccionId.error,
                        }"
                        id="seccion"
                        :value="formulario.seccionId"
                        @change="
                            actualizarCampo(
                                'seccionId',
                                parseInt(
                                    ($event.target as HTMLSelectElement).value
                                )
                            )
                        "
                        @blur="marcarTocado('seccionId')"
                        :disabled="
                            !gradoSeleccionado ||
                            seccionesFiltradas.length === 0
                        "
                    >
                        <option value="0">Seleccione una sección</option>
                        <option
                            v-for="seccion in seccionesFiltradas"
                            :key="seccion.id"
                            :value="seccion.id"
                        >
                            {{ obtenerInfoSeccion(seccion) }}
                        </option>
                    </select>
                    <div
                        v-if="campos.seccionId.tocado && campos.seccionId.error"
                        class="invalid-feedback"
                    >
                        {{ campos.seccionId.error }}
                    </div>
                    <small
                        v-if="
                            seccionesFiltradas.length === 0 && gradoSeleccionado
                        "
                        class="text-danger"
                    >
                        No hay secciones disponibles con cupos
                    </small>
                </div>

                <div v-if="seccionSeleccionada" class="col-12">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title mb-2">
                                <i class="bi bi-grid-3x3-gap me-2"></i>
                                Detalles de la Sección
                            </h6>
                            <div class="row g-2">
                                <div class="col-md-4">
                                    <small class="text-muted">Turno:</small>
                                    <p class="mb-0 text-capitalize">
                                        {{ seccionSeleccionada.turno }}
                                    </p>
                                </div>
                                <div class="col-md-4">
                                    <small class="text-muted">Capacidad:</small>
                                    <p class="mb-0">
                                        {{
                                            seccionSeleccionada.capacidadMaxima
                                        }}
                                        estudiantes
                                    </p>
                                </div>
                                <div class="col-md-4">
                                    <small class="text-muted"
                                        >Matriculados:</small
                                    >
                                    <p class="mb-0">
                                        {{
                                            seccionSeleccionada.matriculas?.filter(
                                                (m) => m.estado === "activa"
                                            ).length || 0
                                        }}
                                    </p>
                                </div>
                                <div class="col-12">
                                    <small class="text-muted"
                                        >Profesor Tutor:</small
                                    >
                                    <p class="mb-0">
                                        <span
                                            v-if="seccionSeleccionada.profesor"
                                        >
                                            {{
                                                seccionSeleccionada.profesor
                                                    .nombres
                                            }}
                                            {{
                                                seccionSeleccionada.profesor
                                                    .apellidos
                                            }}
                                        </span>
                                        <span v-else class="text-muted"
                                            >Sin tutor asignado</span
                                        >
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 mt-4">
                    <div class="d-flex gap-2 justify-content-end">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click="manejarCancelar"
                        >
                            <i class="bi bi-x-circle me-1"></i>
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-circle me-1"></i>
                            Matricular
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
.form-label {
    font-weight: 500;
}

.text-danger {
    font-size: 0.875rem;
}

.card.bg-light {
    border: 1px solid #dee2e6;
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
    border-width: 0.15em;
}
</style>
