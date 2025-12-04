<!-- src/componentes/secciones/TablaSecciones.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { Seccion } from '@/tipos';
import TablaGenerica from '@/components/comunes/TablaGenerica.vue';

interface Props {
  secciones: Seccion[];
  cargando?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  cargando: false,
});

const emit = defineEmits<{
  ver: [seccion: Seccion];
  editar: [seccion: Seccion];
  eliminar: [seccion: Seccion];
}>();

const columnas = [
  { clave: 'nivel', etiqueta: 'Nivel', ancho: '15%' },
  { clave: 'grado', etiqueta: 'Grado', ancho: '15%' },
  { clave: 'nombre', etiqueta: 'Sección', ancho: '10%' },
  { clave: 'profesor', etiqueta: 'Profesor Tutor', ancho: '20%' },
  { clave: 'turno', etiqueta: 'Turno', ancho: '10%' },
  { clave: 'ocupacion', etiqueta: 'Ocupación', ancho: '15%' },
  { clave: 'capacidad', etiqueta: 'Capacidad', ancho: '15%' },
];

const seccionesConDatos = computed(() => {
  return props.secciones.map((seccion) => {
    const estudiantes = seccion.matriculas?.filter((m) => m.estado === 'activa').length || 0;
    return {
      ...seccion,
      nivel: seccion.grado?.nivel?.nombre || '-',
      grado: seccion.grado?.nombre || '-',
      profesor: seccion.profesor
        ? `${seccion.profesor.nombres} ${seccion.profesor.apellidos}`
        : 'Sin asignar',
      ocupacion: estudiantes,
      capacidad: seccion.capacidadMaxima,
      porcentajeOcupacion: (estudiantes / seccion.capacidadMaxima) * 100,
    };
  });
});

const manejarAccion = (accion: string, item: any) => {
  const seccionOriginal = props.secciones.find(s => s.id === item.id);
  if (!seccionOriginal) return;

  if (accion === 'ver') {
    emit('ver', seccionOriginal);
  } else if (accion === 'editar') {
    emit('editar', seccionOriginal);
  } else if (accion === 'eliminar') {
    emit('eliminar', seccionOriginal);
  }
};

const obtenerClaseOcupacion = (porcentaje: number) => {
  if (porcentaje >= 100) return 'bg-danger';
  if (porcentaje >= 80) return 'bg-warning';
  return 'bg-success';
};
</script>

<template>
  <TablaGenerica
    :columnas="columnas"
    :datos="seccionesConDatos"
    :cargando="cargando"
    mensaje-vacio="No hay secciones registradas"
    @accion="manejarAccion"
  >
    <template #columna-nombre="{ item }">
      <span class="badge bg-primary fs-6">{{ item.nombre }}</span>
    </template>

    <template #columna-turno="{ item }">
      <span class="text-capitalize">{{ item.turno }}</span>
    </template>

    <template #columna-ocupacion="{ item }">
      <div class="d-flex align-items-center">
        <div class="progress flex-grow-1 me-2" style="height: 20px">
          <div
            class="progress-bar"
            :class="obtenerClaseOcupacion(item.porcentajeOcupacion)"
            :style="{ width: `${Math.min(item.porcentajeOcupacion, 100)}%` }"
          >
            {{ item.ocupacion }}
          </div>
        </div>
      </div>
    </template>

    <template #columna-capacidad="{ item }">
      <span class="badge bg-secondary">{{ item.capacidad }}</span>
    </template>
  </TablaGenerica>
</template>

<style scoped>
.progress {
  min-width: 80px;
}
</style>