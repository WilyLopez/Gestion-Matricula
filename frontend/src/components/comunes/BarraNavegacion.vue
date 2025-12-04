<!-- src/components/comunes/BarraNavegacion.vue -->
<script setup lang="ts">
import { computed } from 'vue';

const formattedDate = computed(() => {
  const date = new Date();
  const weekday = date.toLocaleDateString('es-ES', { weekday: 'long' });
  const month = date.toLocaleDateString('es-ES', { month: 'short' });
  const year = date.getFullYear();
  
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return `[${capitalize(weekday)}, ${capitalize(month)}, ${year}]`;
});
</script>

<template>
    <header class="header-bar shadow-sm">
        <div class="container-fluid d-flex justify-content-between align-items-center">
            <div class="header-title">
                <!-- El título se puede hacer dinámico si es necesario -->
            </div>
            <div class="header-info d-flex align-items-center">
                <span class="date-display me-4">{{ formattedDate }}</span>
                <div class="user-display d-flex align-items-center">
                    <i class="bi bi-person-circle me-2"></i>
                    <span>Administrador</span>
                </div>
            </div>
        </div>
    </header>
</template>

<style scoped>
.header-bar {
    background-color: #ffffff;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #dee2e6;
}

.header-info {
    font-size: 0.9rem;
    color: #6c757d;
}

.user-display i {
    font-size: 1.5rem;
    color: #495057;
}

.date-display {
    font-weight: 500;
}
</style>
