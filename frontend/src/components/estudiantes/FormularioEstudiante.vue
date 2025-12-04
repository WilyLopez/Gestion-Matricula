<!-- src/componentes/estudiantes/FormularioEstudiante.vue -->
<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { Estudiante, EstudianteFormulario } from "@/tipos";
import { useValidacion, CampoValidacion } from "@/composables/useValidacion";

interface Props {
    estudiante?: Estudiante | null;
}

const props = withDefaults(defineProps<Props>(), {
    estudiante: null,
});

const emit = defineEmits<{
    guardar: [datos: EstudianteFormulario];
    cancelar: [];
}>();

const { validarCampo, validarFormulario, resetearCampos } = useValidacion();

const modoEdicion = computed(() => !!props.estudiante);

const formulario = reactive<EstudianteFormulario>({
    nombres: "",
    apellidos: "",
    dni: "",
    fechaNacimiento: "",
    direccion: "",
    telefono: "",
});

const campos = reactive<Record<string, CampoValidacion>>({
    nombres: { valor: "", reglas: { requerido: true, minLongitud: 2, maxLongitud: 100 }, tocado: false, error: "" },
    apellidos: { valor: "", reglas: { requerido: true, minLongitud: 2, maxLongitud: 100 }, tocado: false, error: "" },
    dni: { valor: "", reglas: { requerido: true, dni: true }, tocado: false, error: "" },
    fechaNacimiento: { valor: "", reglas: { requerido: true, fecha: true }, tocado: false, error: "" },
    direccion: { valor: "", reglas: { requerido: true, minLongitud: 5, maxLongitud: 255 }, tocado: false, error: "" },
    telefono: { valor: "", reglas: { requerido: true, telefono: true }, tocado: false, error: "" },
});

watch(
    () => props.estudiante,
    (nuevoEstudiante) => {
        if (nuevoEstudiante) {
            formulario.nombres = nuevoEstudiante.nombres;
            formulario.apellidos = nuevoEstudiante.apellidos;
            formulario.dni = nuevoEstudiante.dni;
            formulario.fechaNacimiento = nuevoEstudiante.fechaNacimiento.split("T")[0];
            formulario.direccion = nuevoEstudiante.direccion;
            formulario.telefono = nuevoEstudiante.telefono;

            Object.keys(campos).forEach(key => {
                campos[key].valor = formulario[key as keyof EstudianteFormulario];
                campos[key].tocado = false;
                campos[key].error = "";
            });
        } else {
            Object.keys(formulario).forEach(key => {
                (formulario as any)[key] = "";
            });
            resetearCampos(campos);
        }
    },
    { immediate: true }
);

const actualizarCampo = (nombreCampo: keyof EstudianteFormulario, valor: string) => {
    formulario[nombreCampo] = valor;
    campos[nombreCampo].valor = valor;
    if (campos[nombreCampo].tocado) {
        validarCampo(campos[nombreCampo]);
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
        emit("guardar", { ...formulario });
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
                <label for="nombres" class="form-label">
                    Nombres <span class="text-danger">*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': campos.nombres.tocado && campos.nombres.error }"
                    id="nombres"
                    :value="formulario.nombres"
                    @input="actualizarCampo('nombres', ($event.target as HTMLInputElement).value)"
                    @blur="marcarTocado('nombres')"
                    placeholder="Ingrese los nombres"
                />
                <div v-if="campos.nombres.tocado && campos.nombres.error" class="invalid-feedback">
                    {{ campos.nombres.error }}
                </div>
            </div>

            <div class="col-md-6">
                <label for="apellidos" class="form-label">
                    Apellidos <span class="text-danger">*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': campos.apellidos.tocado && campos.apellidos.error }"
                    id="apellidos"
                    :value="formulario.apellidos"
                    @input="actualizarCampo('apellidos', ($event.target as HTMLInputElement).value)"
                    @blur="marcarTocado('apellidos')"
                    placeholder="Ingrese los apellidos"
                />
                <div v-if="campos.apellidos.tocado && campos.apellidos.error" class="invalid-feedback">
                    {{ campos.apellidos.error }}
                </div>
            </div>

            <div class="col-md-6">
                <label for="dni" class="form-label">
                    DNI <span class="text-danger">*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': campos.dni.tocado && campos.dni.error }"
                    id="dni"
                    :value="formulario.dni"
                    @input="actualizarCampo('dni', ($event.target as HTMLInputElement).value)"
                    @blur="marcarTocado('dni')"
                    placeholder="12345678"
                    maxlength="8"
                    :disabled="modoEdicion"
                />
                <div v-if="campos.dni.tocado && campos.dni.error" class="invalid-feedback">
                    {{ campos.dni.error }}
                </div>
            </div>

            <div class="col-md-6">
                <label for="fechaNacimiento" class="form-label">
                    Fecha de Nacimiento <span class="text-danger">*</span>
                </label>
                <input
                    type="date"
                    class="form-control"
                    :class="{ 'is-invalid': campos.fechaNacimiento.tocado && campos.fechaNacimiento.error }"
                    id="fechaNacimiento"
                    :value="formulario.fechaNacimiento"
                    @input="actualizarCampo('fechaNacimiento', ($event.target as HTMLInputElement).value)"
                    @blur="marcarTocado('fechaNacimiento')"
                />
                <div v-if="campos.fechaNacimiento.tocado && campos.fechaNacimiento.error" class="invalid-feedback">
                    {{ campos.fechaNacimiento.error }}
                </div>
            </div>

            <div class="col-md-6">
                <label for="telefono" class="form-label">
                    Teléfono (Padre) <span class="text-danger">*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': campos.telefono.tocado && campos.telefono.error }"
                    id="telefono"
                    :value="formulario.telefono"
                    @input="actualizarCampo('telefono', ($event.target as HTMLInputElement).value)"
                    @blur="marcarTocado('telefono')"
                    placeholder="987654321"
                    maxlength="9"
                />
                <div v-if="campos.telefono.tocado && campos.telefono.error" class="invalid-feedback">
                    {{ campos.telefono.error }}
                </div>
            </div>

            <div class="col-md-6">
                <label for="direccion" class="form-label">
                    Dirección <span class="text-danger">*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': campos.direccion.tocado && campos.direccion.error }"
                    id="direccion"
                    :value="formulario.direccion"
                    @input="actualizarCampo('direccion', ($event.target as HTMLInputElement).value)"
                    @blur="marcarTocado('direccion')"
                    placeholder="Ingrese la dirección"
                />
                <div v-if="campos.direccion.tocado && campos.direccion.error" class="invalid-feedback">
                    {{ campos.direccion.error }}
                </div>
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
