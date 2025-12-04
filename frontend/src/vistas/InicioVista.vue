<!-- src/vistas/InicioVista.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { panelServicio } from '@/servicios/panelServicio';
import { EstadisticasPanel } from '@/tipos';
import TarjetaEstadistica from '@/components/comunes/TarjetaEstadistica.vue';
import Cargando from '@/components/comunes/Cargando.vue';
import Alerta from '@/components/comunes/Alerta.vue';
import { useAlerta } from '@/composables/useAlerta';

const { alerta, mostrarAlerta, cerrarAlerta } = useAlerta();
const estadisticas = ref<EstadisticasPanel | null>(null);
const cargando = ref(true);

const cargarEstadisticas = async () => {
  cargando.value = true;
  try {
    estadisticas.value = await panelServicio.obtenerEstadisticas();
  } catch (error: any) {
    mostrarAlerta("danger", `Error al cargar las estadísticas: ${error.message}`);
  } finally {
    cargando.value = false;
  }
};

onMounted(cargarEstadisticas);
</script>

<template>
  <div class="container-fluid py-4">
    <Alerta v-bind="alerta" @cerrar="cerrarAlerta" />

    <h1 class="h3 mb-4 text-gray-800">Panel de Control</h1>

    <Cargando v-if="cargando" />

    <div v-if="estadisticas && !cargando">
      <!-- Tarjetas de Estadísticas Principales -->
      <div class="row">
        <div class="col-xl-4 col-md-6 mb-4">
          <TarjetaEstadistica
            titulo="Total de Estudiantes"
            :valor="estadisticas.totalEstudiantes"
            icono="bi-people-fill"
            color="primary"
          />
        </div>
        <div class="col-xl-4 col-md-6 mb-4">
          <TarjetaEstadistica
            titulo="Estudiantes Matriculados"
            :valor="estadisticas.totalEstudiantesMatriculados"
            icono="bi-person-check-fill"
            color="success"
          />
        </div>
        <div class="col-xl-4 col-md-6 mb-4">
          <TarjetaEstadistica
            titulo="Total de Profesores"
            :valor="estadisticas.totalProfesores"
            icono="bi-person-video3"
            color="info"
          />
        </div>
      </div>

      <!-- Listas de Secciones -->
      <div class="row">
        <div class="col-lg-6 mb-4">
          <div class="card shadow">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Estudiantes por Nivel</h6>
            </div>
            <div class="card-body">
              <ul v-if="estadisticas.estudiantesPorNivel.length" class="list-group list-group-flush">
                <li v-for="item in estadisticas.estudiantesPorNivel" :key="item.nivel" class="list-group-item d-flex justify-content-between align-items-center">
                  {{ item.nivel }}
                  <span class="badge bg-primary rounded-pill">{{ item.cantidad }}</span>
                </li>
              </ul>
              <p v-else>No hay datos disponibles.</p>
            </div>
          </div>
        </div>
        
        <div class="col-lg-6 mb-4">
          <div class="card shadow">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-success">Secciones con Vacantes</h6>
            </div>
            <div class="card-body">
               <ul v-if="estadisticas.seccionesConVacantes.length" class="list-group list-group-flush">
                <li v-for="item in estadisticas.seccionesConVacantes" :key="item.seccion" class="list-group-item d-flex justify-content-between align-items-center">
                  {{ item.nivel }} - {{ item.grado }} - {{ item.seccion }}
                  <span class="badge bg-success rounded-pill">{{ item.vacantes }}</span>
                </li>
              </ul>
              <p v-else>No hay secciones con vacantes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-fluid {
    max-width: 1400px;
}
</style>
