<!-- src/componentes/secciones/FormularioSeccion.vue -->
<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";
import { Seccion, SeccionFormulario, Nivel, Grado, Profesor } from "@/tipos";
import { useValidacion, CampoValidacion } from "@/composables/useValidacion";
import { nivelServicio } from "@/servicios/nivelServicio";
import { gradoServicio } from "@/servicios/gradoServicio";
import { profesorServicio } from "@/servicios/profesorServicio";

interface Props {
    seccion?: Seccion | null;
}

const props = withDefaults(defineProps<Props>(), {
    seccion: null,
});

const emit = defineEmits<{
    guardar: [datos: SeccionFormulario];
    cancelar: [];
}>();

const { validarCampo, validarFormulario, resetearCampos } = useValidacion();
const modoEdicion = computed(() => !!props.seccion);

const niveles = ref<Nivel[]>([]);
const grados = ref<Grado[]>([]);
const profesores = ref<Profesor[]>([]);
const nivelSeleccionado = ref<number | null>(null);
const cargandoDatos = ref(false);

const formulario = reactive<SeccionFormulario>({
    gradoId: 0,
    nombre: "",
    capacidadMaxima: 30,
    turno: "mañana",
    profesorId: undefined,
});

const campos = reactive<Record<string, CampoValidacion>>({
    gradoId: { valor: 0, reglas: { requerido: true, numero: true, min: 1 }, tocado: false, error: "" },
    nombre: { valor: "", reglas: { requerido: true, minLongitud: 1, maxLongitud: 10 }, tocado: false, error: "" },
    capacidadMaxima: { valor: 30, reglas: { requerido: true, numero: true, min: 10, max: 50 }, tocado: false, error: "" },
    turno: { valor: "mañana", reglas: { requerido: true }, tocado: false, error: "" },
});

onMounted(async () => {
    await cargarDatos();
});

watch(
    () => props.seccion,
    async (nuevaSeccion) => {
        if (nuevaSeccion) {
            formulario.gradoId = nuevaSeccion.gradoId;
            formulario.nombre = nuevaSeccion.nombre;
            formulario.capacidadMaxima = nuevaSeccion.capacidadMaxima;
            formulario.turno = nuevaSeccion.turno;
            formulario.profesorId = nuevaSeccion.profesorId || undefined;

            Object.keys(campos).forEach(key => {
                campos[key].valor = formulario[key as keyof SeccionFormulario];
                campos[key].tocado = false;
                campos[key].error = "";
            });

            if (nuevaSeccion.grado?.nivelId) {
                nivelSeleccionado.value = nuevaSeccion.grado.nivelId;
                await cargarGradosPorNivel(nuevaSeccion.grado.nivelId);
            }
        } else {
            Object.keys(formulario).forEach(key => {
                if (key === 'capacidadMaxima') (formulario as any)[key] = 30;
                else if (key === 'turno') (formulario as any)[key] = 'mañana';
                else if (key === 'gradoId') (formulario as any)[key] = 0;
                else (formulario as any)[key] = key === 'profesorId' ? undefined : "";
            });
            nivelSeleccionado.value = null;
            grados.value = [];
            resetearCampos(campos);
        }
    },
    { immediate: true }
);

const cargarDatos = async () => {
    cargandoDatos.value = true;
    try {
        [niveles.value, profesores.value] = await Promise.all([
            nivelServicio.obtenerTodos(),
            profesorServicio.obtenerTodos(),
        ]);
    } catch (error) {
        console.error("Error al cargar datos:", error);
    } finally {
        cargandoDatos.value = false;
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

const manejarCambioNivel = async (evento: Event) => {
    const nivelId = parseInt((evento.target as HTMLSelectElement).value);
    nivelSeleccionado.value = nivelId;
    formulario.gradoId = 0;
    campos.gradoId.valor = 0;
    grados.value = [];

    if (nivelId) {
        await cargarGradosPorNivel(nivelId);
    }
};

const actualizarCampo = (nombreCampo: keyof SeccionFormulario, valor: any) => {
    formulario[nombreCampo] = valor as never;
    if (campos[nombreCampo]) {
        campos[nombreCampo].valor = valor;
        if (campos[nombreCampo].tocado) {
            validarCampo(campos[nombreCampo]);
        }
    }
};

const marcarTocado = (nombreCampo: string) => {
    if (campos[nombreCampo]) {
        campos[nombreCampo].tocado = true;
        validarCampo(campos[nombreCampo]);
    }
};

const manejarEnvio = () => {
    if (validarFormulario(campos)) {
        const datos: SeccionFormulario = {
            ...formulario,
            profesorId: formulario.profesorId || undefined,
        };
        emit("guardar", datos);
    }
};

const manejarCancelar = () => {
    emit("cancelar");
};
</script>

<template>
    <form @submit.prevent="manejarEnvio">
        <div class="row g-3">
            <div class="col-md-6">
                <label for="nivel" class="form-label">
                    Nivel <span class="text-danger">*</span>
                </label>
                <select
                    class="form-select"
                    id="nivel"
                    :value="nivelSeleccionado || ''"
                    @change="manejarCambioNivel"
                    :disabled="cargandoDatos || modoEdicion"
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
                    :class="{ 'is-invalid': campos.gradoId.tocado && campos.gradoId.error }"
                    id="grado"
                    :value="formulario.gradoId"
                    @change="actualizarCampo('gradoId', parseInt(($event.target as HTMLSelectElement).value))"
                    @blur="marcarTocado('gradoId')"
                    :disabled="!nivelSeleccionado || grados.length === 0 || modoEdicion"
                >
                    <option value="0">Seleccione un grado</option>
                    <option
                        v-for="grado in grados"
                        :key="grado.id"
                        :value="grado.id"
                    >
                        {{ grado.nombre }}
                    </option>
                </select>
                <div v-if="campos.gradoId.tocado && campos.gradoId.error" class="invalid-feedback">
                    {{ campos.gradoId.error }}
                </div>
            </div>

            <div class="col-md-6">
                <label for="nombre" class="form-label">
                    Nombre de Sección <span class="text-danger">*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': campos.nombre.tocado && campos.nombre.error }"
                    id="nombre"
                    :value="formulario.nombre"
                    @input="actualizarCampo('nombre', ($event.target as HTMLInputElement).value)"
                    @blur="marcarTocado('nombre')"
                    placeholder="A, B, C..."
                    maxlength="10"
                />
                <div v-if="campos.nombre.tocado && campos.nombre.error" class="invalid-feedback">
                    {{ campos.nombre.error }}
                </div>
            </div>

            <div class="col-md-6">
                <label for="capacidadMaxima" class="form-label">
                    Capacidad Máxima <span class="text-danger">*</span>
                </label>
                <input
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': campos.capacidadMaxima.tocado && campos.capacidadMaxima.error }"
                    id="capacidadMaxima"
                    :value="formulario.capacidadMaxima"
                    @input="actualizarCampo('capacidadMaxima', parseInt(($event.target as HTMLInputElement).value))"
                    @blur="marcarTocado('capacidadMaxima')"
                    min="10"
                    max="50"
                />
                <div v-if="campos.capacidadMaxima.tocado && campos.capacidadMaxima.error" class="invalid-feedback">
                    {{ campos.capacidadMaxima.error }}
                </div>
                <small class="form-text text-muted">Entre 10 y 50 estudiantes</small>
            </div>

            <div class="col-md-6">
                <label for="turno" class="form-label">
                    Turno <span class="text-danger">*</span>
                </label>
                <select
                    class="form-select"
                    :class="{ 'is-invalid': campos.turno.tocado && campos.turno.error }"
                    id="turno"
                    :value="formulario.turno"
                    @change="actualizarCampo('turno', ($event.target as HTMLSelectElement).value)"
                    @blur="marcarTocado('turno')"
                >
                    <option value="mañana">Mañana</option>
                    <option value="tarde">Tarde</option>
                </select>
                <div v-if="campos.turno.tocado && campos.turno.error" class="invalid-feedback">
                    {{ campos.turno.error }}
                </div>
            </div>

            <div class="col-md-6">
                <label for="profesor" class="form-label">
                    Profesor Tutor
                </label>
                <select
                    class="form-select"
                    id="profesor"
                    :value="formulario.profesorId || ''"
                    @change="actualizarCampo('profesorId', parseInt(($event.target as HTMLSelectElement).value) || undefined)"
                    :disabled="cargandoDatos"
                >
                    <option value="">Sin asignar</option>
                    <option
                        v-for="profesor in profesores"
                        :key="profesor.id"
                        :value="profesor.id"
                    >
                        {{ profesor.nombres }} {{ profesor.apellidos }} - {{ profesor.especialidad }}
                    </option>
                </select>
                <small class="form-text text-muted">Opcional</small>
            </div>
        </div>

        <div class="mt-4 d-flex gap-2 justify-content-end">
            <button type="button" class="btn btn-secondary" @click="manejarCancelar">
                <i class="bi bi-x-circle me-1"></i>
                Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
                <i class="bi bi-check-circle me-1"></i>
                {{ modoEdicion ? "Actualizar" : "Guardar" }}
            </button>
        </div>
    </form>
</template>

<style scoped>
.form-label {
    font-weight: 500;
}

.text-danger {
    font-size: 0.875rem;
}
</style>
