<!-- src/componentes/comunes/BarraNavegacion.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const menuAbierto = ref(false);

const toggleMenu = () => {
    menuAbierto.value = !menuAbierto.value;
};

const navegarA = (ruta: string) => {
    router.push(ruta);
    menuAbierto.value = false;
};

const esRutaActiva = (ruta: string) => {
    return route.path === ruta;
};
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container-fluid">
            <a
                class="navbar-brand d-flex align-items-center"
                href="#"
                @click.prevent="navegarA('/')"
            >
                <i class="bi bi-mortarboard-fill me-2"></i>
                <span>Sistema de Matrícula</span>
            </a>

            <button
                class="navbar-toggler"
                type="button"
                @click="toggleMenu"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div
                class="collapse navbar-collapse"
                :class="{ show: menuAbierto }"
            >
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            :class="{ active: esRutaActiva('/') }"
                            href="#"
                            @click.prevent="navegarA('/')"
                        >
                            <i class="bi bi-house-door me-1"></i>
                            Inicio
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            :class="{ active: esRutaActiva('/estudiantes') }"
                            href="#"
                            @click.prevent="navegarA('/estudiantes')"
                        >
                            <i class="bi bi-people me-1"></i>
                            Estudiantes
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            :class="{ active: esRutaActiva('/profesores') }"
                            href="#"
                            @click.prevent="navegarA('/profesores')"
                        >
                            <i class="bi bi-person-badge me-1"></i>
                            Profesores
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            :class="{ active: esRutaActiva('/secciones') }"
                            href="#"
                            @click.prevent="navegarA('/secciones')"
                        >
                            <i class="bi bi-grid-3x3-gap me-1"></i>
                            Secciones
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            :class="{ active: esRutaActiva('/matriculas') }"
                            href="#"
                            @click.prevent="navegarA('/matriculas')"
                        >
                            <i class="bi bi-clipboard-check me-1"></i>
                            Matrículas
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    margin-bottom: 2rem;
}

.navbar-brand {
    font-weight: 600;
    font-size: 1.25rem;
}

.navbar-brand i {
    font-size: 1.5rem;
}

.nav-link {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s ease;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
    background-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 991px) {
    .navbar-collapse {
        background-color: rgba(0, 0, 0, 0.05);
        padding: 1rem;
        border-radius: 0.25rem;
        margin-top: 0.5rem;
    }
}
</style>
