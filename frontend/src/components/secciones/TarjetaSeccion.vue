<!-- src/componentes/secciones/TarjetaSeccion.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { Seccion } from '@/tipos';

interface Props {
  seccion: Seccion;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  ver: [];
  editar: [];
}>();

const estudiantesMatriculados = computed(() => {
  return props.seccion.matriculas?.filter((m) => m.estado === 'activa').length || 0;
});

const cuposDisponibles = computed(() => {
  return props.seccion.capacidadMaxima - estudiantesMatriculados.value;
});

const porcentajeOcupacion = computed(() => {
  return (estudiantesMatriculados.value / props.seccion.capacidadMaxima) * 100;
});

const claseEstado = computed(() => {
  if (cuposDisponibles.value === 0) return 'danger';
  if (cuposDisponibles.value <= 5) return 'warning';
  return 'success';
});
</script>

<template>
  <div class="card tarjeta-seccion h-100 tarjeta-sombra">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 class="card-title mb-1">
            <span class="badge bg-primary me-2">{{ seccion.nombre }}</span>
            {{ seccion.grado?.nombre }}
          </h5>
          <p class="text-muted small mb-0">
            <i class="bi bi-mortarboard me-1"></i>
            {{ seccion.grado?.nivel?.nombre }}
          </p>
        </div>
        <span class="badge" :class="`bg-${claseEstado}`">
          {{ cuposDisponibles }} cupos
        </span>
      </div>

      <div class="mb-3">
        <div class="d-flex justify-content-between mb-1">
          <small class="text-muted">Ocupación</small>
          <small class="fw-bold">{{ estudiantesMatriculados }}/{{ seccion.capacidadMaxima }}</small>
        </div>
        <div class="progress" style="height: 10px">
          <div
            class="progress-bar"
            :class="`bg-${claseEstado}`"
            :style="{ width: `${Math.min(porcentajeOcupacion, 100)}%` }"
          ></div>
        </div>
      </div>

      <div class="info-adicional">
        <div class="d-flex align-items-center mb-2">
          <i class="bi bi-clock text-muted me-2"></i>
          <span class="small text-capitalize">Turno {{ seccion.turno }}</span>
        </div>
        <div class="d-flex align-items-center">
          <i class="bi bi-person-badge text-muted me-2"></i>
          <span class="small" v-if="seccion.profesor">
            {{ seccion.profesor.nombres }} {{ seccion.profesor.apellidos }}
          </span>
          <span class="small text-muted" v-else>Sin tutor asignado</span>
        </div>
      </div>

      <div class="mt-3 d-flex gap-2">
        <button class="btn btn-sm btn-outline-primary flex-grow-1" @click="emit('ver')">
          <i class="bi bi-eye me-1"></i>
          Ver
        </button>
        <button class="btn btn-sm btn-outline-success flex-grow-1" @click="emit('editar')">
          <i class="bi bi-pencil me-1"></i>
          Editar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tarjeta-seccion {
  border: none;
  border-radius: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tarjeta-seccion:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card-title {
  font-size: 1.1rem;
}

.info-adicional {
  border-top: 1px solid #dee2e6;
  padding-top: 0.75rem;
}
</style>