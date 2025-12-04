<!-- src/componentes/profesores/FormularioProfesor.vue -->
<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { Profesor, ProfesorFormulario } from "@/tipos";
import { useValidacion, CampoValidacion } from "@/composables/useValidacion";

interface Props {
    profesor?: Profesor | null;
}

const props = withDefaults(defineProps<Props>(), {
    profesor: null,
});

const emit = defineEmits<{
    guardar: [datos: ProfesorFormulario];
    cancelar: [];
}>();

const { validarCampo, validarFormulario, resetearCampos } = useValidacion();

const modoEdicion = computed(() => !!props.profesor);

const formulario = reactive<ProfesorFormulario>({
    nombres: "",
    apellidos: "",
    dni: "",
    especialidad: "",
    telefono: "",
    email: "",
});

const campos = reactive<Record<string, CampoValidacion>>({
    nombres: { valor: "", reglas: { requerido: true, minLongitud: 2, maxLongitud: 100 }, tocado: false, error: "" },
    apellidos: { valor: "", reglas: { requerido: true, minLongitud: 2, maxLongitud: 100 }, tocado: false, error: "" },
    dni: { valor: "", reglas: { requerido: true, dni: true }, tocado: false, error: "" },
    especialidad: { valor: "", reglas: { requerido: true, minLongitud: 3, maxLongitud: 100 }, tocado: false, error: "" },
    telefono: { valor: "", reglas: { requerido: true, telefono: true }, tocado: false, error: "" },
    email: { valor: "", reglas: { requerido: true, email: true }, tocado: false, error: "" },
});

watch(
    () => props.profesor,
    (nuevoProfesor) => {
        if (nuevoProfesor) {
            formulario.nombres = nuevoProfesor.nombres;
            formulario.apellidos = nuevoProfesor.apellidos;
            formulario.dni = nuevoProfesor.dni;
            formulario.especialidad = nuevoProfesor.especialidad;
            formulario.telefono = nuevoProfesor.telefono;
            formulario.email = nuevoProfesor.email;
            
            Object.keys(campos).forEach(key => {
                campos[key].valor = formulario[key as keyof ProfesorFormulario];
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

const actualizarCampo = (nombreCampo: keyof ProfesorFormulario, valor: string) => {
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
                <label for="especialidad" class="form-label">
                    Especialidad <span class="text-danger">*</span>
                </label>
                <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': campos.especialidad.tocado && campos.especialidad.error }"
                    id="especialidad"
                    :value="formulario.especialidad"
                    @input="actualizarCampo('especialidad', ($event.target as HTMLInputElement).value)"
                    @blur="marcarTocado('especialidad')"
                    placeholder="Ej: Matemática, Comunicación"
                />
                <div v-if="campos.especialidad.tocado && campos.especialidad.error" class="invalid-feedback">
                    {{ campos.especialidad.error }}
                </div>
            </div>

            <div class="col-md-6">
                <label for="telefono" class="form-label">
                    Teléfono <span class="text-danger">*</span>
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
                <label for="email" class="form-label">
                    Email <span class="text-danger">*</span>
                </label>
                <input
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': campos.email.tocado && campos.email.error }"
                    id="email"
                    :value="formulario.email"
                    @input="actualizarCampo('email', ($event.target as HTMLInputElement).value)"
                    @blur="marcarTocado('email')"
                    placeholder="profesor@colegio.edu"
                />
                <div v-if="campos.email.tocado && campos.email.error" class="invalid-feedback">
                    {{ campos.email.error }}
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
