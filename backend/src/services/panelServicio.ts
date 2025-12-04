// src/servicios/panelServicio.ts
import { EstudianteRepositorio } from "../repository/estudianteRepositorio";
import { ProfesorRepositorio } from "../repository/profesorRepositorio";
import { SeccionRepositorio } from "../repository/seccionRepositorio";
import { MatriculaRepositorio } from "../repository/matriculaRepositorio";
import { AnioAcademicoRepositorio } from "../repository/anioAcademicoRepositorio";
import { EstadisticasPanel } from "../types";
import { Prisma } from '@prisma/client'; // Importar Prisma

// Definir el tipo para Seccion con sus relaciones incluidas
type SeccionConRelaciones = Prisma.SeccionGetPayload<{
    include: {
        grado: {
            include: { nivel: true }
        },
        profesor: true, // Esto ya estaba en el repositorio, pero es bueno explicitarlo
        matriculas: {
            where: { estado: "activa" }
        }
    }
}>;

export class PanelServicio {
    private estudianteRepositorio: EstudianteRepositorio;
    private profesorRepositorio: ProfesorRepositorio;
    private seccionRepositorio: SeccionRepositorio;
    private matriculaRepositorio: MatriculaRepositorio;
    private anioAcademicoRepositorio: AnioAcademicoRepositorio;

    constructor() {
        this.estudianteRepositorio = new EstudianteRepositorio();
        this.profesorRepositorio = new ProfesorRepositorio();
        this.seccionRepositorio = new SeccionRepositorio();
        this.matriculaRepositorio = new MatriculaRepositorio();
        this.anioAcademicoRepositorio = new AnioAcademicoRepositorio();
    }

    async obtenerEstadisticas(): Promise<EstadisticasPanel> {
        const anioActivo = await this.anioAcademicoRepositorio.obtenerActivo();

        if (!anioActivo) {
            throw new Error("No hay un año académico activo");
        }

        const totalEstudiantes = await this.estudianteRepositorio.contarTodos();
        const totalProfesores = await this.profesorRepositorio.contarTodos();
        const totalEstudiantesMatriculados =
            await this.matriculaRepositorio.contarMatriculasActivas(
                anioActivo.id
            );

        const estudiantesPorNivel =
            await this.matriculaRepositorio.contarPorNivel(anioActivo.id);

        const todasSecciones: SeccionConRelaciones[] = await this.seccionRepositorio.obtenerTodas();

        const seccionesConCantidad = todasSecciones.map((seccion) => ({
            seccion: seccion.nombre,
            grado: seccion.grado.nombre,
            nivel: seccion.grado.nivel.nombre,
            cantidad: seccion.matriculas.length,
            capacidad: seccion.capacidadMaxima,
        }));

        const seccionesConMasEstudiantes = seccionesConCantidad
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5)
            .map(({ seccion, grado, nivel, cantidad }) => ({
                seccion,
                grado,
                nivel,
                cantidad,
            }));

        const seccionesConVacantes = seccionesConCantidad
            .filter((s) => s.cantidad < s.capacidad)
            .map(({ seccion, grado, nivel, cantidad, capacidad }) => ({
                seccion,
                grado,
                nivel,
                vacantes: capacidad - cantidad,
            }))
            .sort((a, b) => b.vacantes - a.vacantes);

        return {
            totalEstudiantes,
            totalEstudiantesMatriculados,
            totalProfesores,
            estudiantesPorNivel,
            seccionesConMasEstudiantes,
            seccionesConVacantes,
        };
    }
}
