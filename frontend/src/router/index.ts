// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import InicioVista from '@/vistas/InicioVista.vue';
import EstudiantesVista from '@/vistas/EstudiantesVista.vue';
import DetalleEstudianteVista from '@/vistas/DetalleEstudianteVista.vue';
import ProfesoresVista from '@/vistas/ProfesoresVista.vue';
import SeccionesVista from '@/vistas/SeccionesVista.vue';
import MatriculasVista from '@/vistas/MatriculasVista.vue';

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: InicioVista,
  },
  {
    path: '/estudiantes',
    name: 'Estudiantes',
    component: EstudiantesVista,
  },
  {
    path: '/estudiantes/:id',
    name: 'DetalleEstudiante',
    component: DetalleEstudianteVista,
    props: true,
  },
  {
    path: '/profesores',
    name: 'Profesores',
    component: ProfesoresVista,
  },
  {
    path: '/secciones',
    name: 'Secciones',
    component: SeccionesVista,
  },
  {
    path: '/matriculas',
    name: 'Matriculas',
    component: MatriculasVista,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
