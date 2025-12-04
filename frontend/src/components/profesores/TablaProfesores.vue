<!-- src/componentes/profesores/TablaProfesores.vue -->
<script setup lang="ts">
import { Profesor } from "@/tipos";
import TablaGenerica from "@/components/comunes/TablaGenerica.vue";

interface Props {
    profesores: Profesor[];
    cargando?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    cargando: false,
});

const emit = defineEmits<{
    ver: [profesor: Profesor];
    editar: [profesor: Profesor];
    eliminar: [profesor: Profesor];
}>();

const columnas = [
    { clave: "nombres", etiqueta: "Nombres", ancho: "18%" },
    { clave: "apellidos", etiqueta: "Apellidos", ancho: "18%" },
    { clave: "dni", etiqueta: "DNI", ancho: "12%" },
    { clave: "especialidad", etiqueta: "Especialidad", ancho: "17%" },
    { clave: "telefono", etiqueta: "Teléfono", ancho: "13%" },
    { clave: "email", etiqueta: "Email", ancho: "22%" },
];

const manejarAccion = (accion: string, profesor: Profesor) => {
    if (accion === "ver") {
        emit("ver", profesor);
    } else if (accion === "editar") {
        emit("editar", profesor);
    } else if (accion === "eliminar") {
        emit("eliminar", profesor);
    }
};
</script>

<template>
    <TablaGenerica
        :columnas="columnas"
        :datos="profesores"
        :cargando="cargando"
        mensaje-vacio="No hay profesores registrados"
        @accion="manejarAccion"
    />
</template>
