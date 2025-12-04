<!-- src/componentes/estudiantes/TablaEstudiantes.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { Estudiante } from "@/tipos";
import TablaGenerica from "@/components/comunes/TablaGenerica.vue";

interface Props {
    estudiantes: Estudiante[];
    cargando?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    cargando: false,
});

const emit = defineEmits<{
    ver: [estudiante: Estudiante];
    editar: [estudiante: Estudiante];
    eliminar: [estudiante: Estudiante];
}>();

const columnas = [
    { clave: "nombres", etiqueta: "Nombres", ancho: "20%" },
    { clave: "apellidos", etiqueta: "Apellidos", ancho: "20%" },
    { clave: "dni", etiqueta: "DNI", ancho: "12%" },
    { clave: "fechaNacimiento", etiqueta: "Fecha Nac.", ancho: "15%" },
    { clave: "telefono", etiqueta: "Teléfono", ancho: "13%" },
    { clave: "estado", etiqueta: "Estado", ancho: "10%" },
];

const estudiantesConEstado = computed(() => {
    return props.estudiantes.map((estudiante) => ({
        ...estudiante,
        estado: estudiante.matriculas?.some((m) => m.estado === "activa")
            ? "Matriculado"
            : "Sin matrícula",
    }));
});

const manejarAccion = (accion: string, estudiante: Estudiante) => {
    if (accion === "ver") {
        emit("ver", estudiante);
    } else if (accion === "editar") {
        emit("editar", estudiante);
    } else if (accion === "eliminar") {
        emit("eliminar", estudiante);
    }
};

const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-PE");
};
</script>

<template>
    <TablaGenerica
        :columnas="columnas"
        :datos="estudiantesConEstado"
        :cargando="cargando"
        mensaje-vacio="No hay estudiantes registrados"
        @accion="manejarAccion"
    >
        <template #columna-fechaNacimiento="{ item }">
            {{ formatearFecha(item.fechaNacimiento) }}
        </template>

        <template #columna-estado="{ item }">
            <span
                class="badge"
                :class="{
                    'bg-success': item.estado === 'Matriculado',
                    'bg-secondary': item.estado === 'Sin matrícula',
                }"
            >
                {{ item.estado }}
            </span>
        </template>
    </TablaGenerica>
</template>
