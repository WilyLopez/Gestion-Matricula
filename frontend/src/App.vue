<!-- src/App.vue -->
<script setup lang="ts">
import { RouterView } from 'vue-router';
import BarraNavegacion from '@/components/comunes/BarraNavegacion.vue';
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <h1 class="sidebar-header">Gestión Matrícula</h1>
      <nav class="nav-links">
        <router-link to="/" class="nav-link">
          <i class="bi bi-house-door-fill"></i>
          <span>Inicio</span>
        </router-link>
        <router-link :to="{ name: 'Estudiantes' }" class="nav-link">
          <i class="bi bi-people-fill"></i>
          <span>Estudiantes</span>
        </router-link>
        <router-link :to="{ name: 'Profesores' }" class="nav-link">
          <i class="bi bi-person-video3"></i>
          <span>Profesores</span>
        </router-link>
        <router-link :to="{ name: 'Secciones' }" class="nav-link">
          <i class="bi bi-grid-3x3-gap-fill"></i>
          <span>Secciones</span>
        </router-link>
        <router-link :to="{ name: 'Matriculas' }" class="nav-link">
          <i class="bi bi-card-list"></i>
          <span>Matrículas</span>
        </router-link>
      </nav>
    </aside>
    <main class="main-content">
      <BarraNavegacion />
      <div class="content-wrapper">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 260px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  flex-shrink: 0;
}

.sidebar-header {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  color: #bdc3c7;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  background-color: #34495e;
  color: white;
}

.nav-link i {
  font-size: 1.2rem;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #f4f7f6;
  overflow: auto;
}

.content-wrapper {
  padding: 1rem;
  flex-grow: 1;
}
</style>
