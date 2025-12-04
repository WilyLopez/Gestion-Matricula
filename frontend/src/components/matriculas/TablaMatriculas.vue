<script setup lang="ts">
import { computed } from "vue";
import { Matricula } from "@/tipos";
import TablaGenerica from "@/components/comunes/TablaGenerica.vue";

interface Props {
    matriculas: Matricula[];
    cargando?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    cargando: false,
});

const emit = defineEmits<{
    ver: [matricula: Matricula];
    cambiarEstado: [matricula: Matricula];
    eliminar: [matricula: Matricula];
}>();

const columnas = [
    { clave: "estudiante", etiqueta: "Estudiante", ancho: "20%" },
    { clave: "nivel", etiqueta: "Nivel", ancho: "12%" },
    { clave: "grado", etiqueta: "Grado", ancho: "12%" },
    { clave: "seccion", etiqueta: "Sección", ancho: "10%" },
    { clave: "anio", etiqueta: "Año", ancho: "10%" },
    { clave: "fecha", etiqueta: "Fecha Matrícula", ancho: "13%" },
    { clave: "estado", etiqueta: "Estado", ancho: "13%" },
];

const matriculasConDatos = computed(() => {
    return props.matriculas.map((matricula) => ({
        ...matricula,
        estudiante: `${matricula.estudiante?.nombres} ${matricula.estudiante?.apellidos}`,
        nivel: matricula.seccion?.grado?.nivel?.nombre || "-",
        grado: matricula.seccion?.grado?.nombre || "-",
        seccion: matricula.seccion?.nombre || "-",
        anio: matricula.anioAcademico?.anio || "-",
    }));
});

const manejarAccion = (accion: string, item: any) => {
    const matriculaOriginal = props.matriculas.find(m => m.id === item.id);
    if (!matriculaOriginal) {
        console.error("No se encontró la matrícula original para la acción.");
        return;
    }

    if (accion === "ver") {
        emit("ver", matriculaOriginal);
    } else if (accion === "editar") {
        emit("cambiarEstado", matriculaOriginal);
    } else if (accion === "eliminar") {
        emit("eliminar", matriculaOriginal);
    }
};

const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-PE");
};

const obtenerClaseEstado = (estado: string) => {
    const clases: Record<string, string> = {
        activa: "bg-success",
        retirado: "bg-danger",
        culminado: "bg-secondary",
    };
    return clases[estado] || "bg-secondary";
};

const obtenerTextoEstado = (estado: string) => {
    const textos: Record<string, string> = {
        activa: "Activa",
        retirado: "Retirado",
        culminado: "Culminado",
    };
    return textos[estado] || estado;
};
</script>

<template>
    <TablaGenerica
        :columnas="columnas"
        :datos="matriculasConDatos"
        :cargando="cargando"
        mensaje-vacio="No hay matrículas registradas"
        @accion="manejarAccion"
    >
        <template #columna-seccion="{ item }">
            <span class="badge bg-primary">{{ item.seccion }}</span>
        </template>

        <template #columna-fecha="{ item }">
            {{ formatearFecha(item.fechaMatricula) }}
        </template>

        <template #columna-estado="{ item }">
            <span class="badge" :class="obtenerClaseEstado(item.estado)">
                {{ obtenerTextoEstado(item.estado) }}
            </span>
        </template>
    </TablaGenerica>
</template>
