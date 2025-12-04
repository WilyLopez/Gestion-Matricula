<!-- src/componentes/estudiantes/DetalleEstudiante.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { Estudiante } from "@/tipos";

interface Props {
    estudiante: Estudiante;
}

const props = defineProps<Props>();

const edad = computed(() => {
    const hoy = new Date();
    const nacimiento = new Date(props.estudiante.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
});

const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const obtenerEstadoMatricula = (estado: string) => {
    const estados: Record<string, string> = {
        activa: "Activa",
        retirado: "Retirado",
        culminado: "Culminado",
    };
    return estados[estado] || estado;
};

const obtenerClaseEstado = (estado: string) => {
    const clases: Record<string, string> = {
        activa: "bg-success",
        retirado: "bg-danger",
        culminado: "bg-secondary",
    };
    return clases[estado] || "bg-secondary";
};
</script>

<template>
    <div class="detalle-estudiante">
        <div class="card mb-4">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">
                    <i class="bi bi-person-circle me-2"></i>
                    Información Personal
                </h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="text-muted small"
                            >Nombres Completos</label
                        >
                        <p class="fw-bold mb-0">
                            {{ estudiante.nombres }} {{ estudiante.apellidos }}
                        </p>
                    </div>
                    <div class="col-md-3">
                        <label class="text-muted small">DNI</label>
                        <p class="fw-bold mb-0">{{ estudiante.dni }}</p>
                    </div>
                    <div class="col-md-3">
                        <label class="text-muted small">Edad</label>
                        <p class="fw-bold mb-0">{{ edad }} años</p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small"
                            >Fecha de Nacimiento</label
                        >
                        <p class="mb-0">
                            {{ formatearFecha(estudiante.fechaNacimiento) }}
                        </p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Teléfono (Padre)</label>
                        <p class="mb-0">{{ estudiante.telefono }}</p>
                    </div>
                    <div class="col-12">
                        <label class="text-muted small">Dirección</label>
                        <p class="mb-0">{{ estudiante.direccion }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header bg-info text-white">
                <h5 class="mb-0">
                    <i class="bi bi-clipboard-check me-2"></i>
                    Historial de Matrículas
                </h5>
            </div>
            <div class="card-body">
                <div
                    v-if="
                        !estudiante.matriculas ||
                        estudiante.matriculas.length === 0
                    "
                    class="text-center text-muted py-4"
                >
                    <i class="bi bi-inbox fs-1"></i>
                    <p class="mb-0 mt-2">No tiene matrículas registradas</p>
                </div>
                <div v-else class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Año Académico</th>
                                <th>Nivel</th>
                                <th>Grado</th>
                                <th>Sección</th>
                                <th>Profesor Tutor</th>
                                <th>Fecha Matrícula</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="matricula in estudiante.matriculas"
                                :key="matricula.id"
                            >
                                <td>{{ matricula.anioAcademico?.anio }}</td>
                                <td>
                                    {{
                                        matricula.seccion?.grado?.nivel?.nombre
                                    }}
                                </td>
                                <td>{{ matricula.seccion?.grado?.nombre }}</td>
                                <td>
                                    <span class="badge bg-primary">{{
                                        matricula.seccion?.nombre
                                    }}</span>
                                </td>
                                <td>
                                    <span v-if="matricula.seccion?.profesor">
                                        {{
                                            matricula.seccion.profesor.nombres
                                        }}
                                        {{
                                            matricula.seccion.profesor.apellidos
                                        }}
                                    </span>
                                    <span v-else class="text-muted"
                                        >Sin asignar</span
                                    >
                                </td>
                                <td>
                                    {{
                                        formatearFecha(matricula.fechaMatricula)
                                    }}
                                </td>
                                <td>
                                    <span
                                        class="badge"
                                        :class="
                                            obtenerClaseEstado(matricula.estado)
                                        "
                                    >
                                        {{
                                            obtenerEstadoMatricula(
                                                matricula.estado
                                            )
                                        }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.detalle-estudiante {
    max-width: 1200px;
}

.card-header h5 {
    font-size: 1.1rem;
}

label.small {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
    display: block;
}
</style>
