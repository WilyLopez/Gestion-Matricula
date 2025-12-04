<!-- src/components/comunes/Paginacion.vue -->
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  paginaActual: number;
  totalPaginas: number;
  limiteVecinos?: number;
}

const props = withDefaults(defineProps<Props>(), {
  limiteVecinos: 1,
});

const emit = defineEmits<{
  (e: 'cambiarPagina', pagina: number): void;
}>();

const cambiarPagina = (pagina: number) => {
  if (pagina < 1 || pagina > props.totalPaginas || pagina === props.paginaActual) {
    return;
  }
  emit('cambiarPagina', pagina);
};

const rangoPaginacion = computed(() => {
  const { paginaActual, totalPaginas, limiteVecinos } = props;
  const rango = [];
  const rangoConPuntos = [];

  for (let i = 1; i <= totalPaginas; i++) {
    if (
      i === 1 ||
      i === totalPaginas ||
      (i >= paginaActual - limiteVecinos && i <= paginaActual + limiteVecinos)
    ) {
      rango.push(i);
    }
  }

  let ultimo;
  for (const pagina of rango) {
    if (ultimo && pagina - ultimo !== 1) {
      rangoConPuntos.push('...');
    }
    rangoConPuntos.push(pagina);
    ultimo = pagina;
  }

  return rangoConPuntos;
});
</script>

<template>
  <nav v-if="totalPaginas > 1" aria-label="Paginación">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: paginaActual === 1 }">
        <a class="page-link" href="#" @click.prevent="cambiarPagina(paginaActual - 1)">
          Anterior
        </a>
      </li>
      <li
        v-for="(pagina, index) in rangoPaginacion"
        :key="index"
        class="page-item"
        :class="{ active: pagina === paginaActual, disabled: typeof pagina === 'string' }"
      >
        <a class="page-link" href="#" @click.prevent="cambiarPagina(pagina as number)">
          {{ pagina }}
        </a>
      </li>
      <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
        <a class="page-link" href="#" @click.prevent="cambiarPagina(paginaActual + 1)">
          Siguiente
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.page-link {
  cursor: pointer;
}
</style>
