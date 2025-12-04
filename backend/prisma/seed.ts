// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Iniciando seed de la base de datos...");

    const primaria = await prisma.nivel.create({
        data: {
            nombre: "Primaria",
        },
    });

    const secundaria = await prisma.nivel.create({
        data: {
            nombre: "Secundaria",
        },
    });

    console.log("Niveles creados");

    const gradosPrimaria = [];
    for (let i = 1; i <= 6; i++) {
        const grado = await prisma.grado.create({
            data: {
                nivelId: primaria.id,
                nombre: `${i}° Grado`,
            },
        });
        gradosPrimaria.push(grado);
    }

    const gradosSecundaria = [];
    for (let i = 1; i <= 5; i++) {
        const grado = await prisma.grado.create({
            data: {
                nivelId: secundaria.id,
                nombre: `${i}° Año`,
            },
        });
        gradosSecundaria.push(grado);
    }

    console.log("Grados creados");

    const profesor1 = await prisma.profesor.create({
        data: {
            nombres: "Juan Carlos",
            apellidos: "Pérez García",
            dni: "12345678",
            especialidad: "Matemática",
            telefono: "987654321",
            email: "juanperez@colegio.edu",
        },
    });

    const profesor2 = await prisma.profesor.create({
        data: {
            nombres: "María Elena",
            apellidos: "López Fernández",
            dni: "87654321",
            especialidad: "Comunicación",
            telefono: "987654322",
            email: "marialopez@colegio.edu",
        },
    });

    const profesor3 = await prisma.profesor.create({
        data: {
            nombres: "Roberto",
            apellidos: "Sánchez Torres",
            dni: "45678912",
            especialidad: "Ciencias",
            telefono: "987654323",
            email: "robertosanchez@colegio.edu",
        },
    });

    console.log("Profesores creados");

    const secciones = ["A", "B", "C"];
    const turnos = ["mañana", "tarde"];

    for (const grado of gradosPrimaria) {
        for (const seccion of secciones) {
            await prisma.seccion.create({
                data: {
                    gradoId: grado.id,
                    nombre: seccion,
                    capacidadMaxima: 30,
                    turno: turnos[Math.floor(Math.random() * turnos.length)],
                    profesorId: [profesor1.id, profesor2.id, profesor3.id][
                        Math.floor(Math.random() * 3)
                    ],
                },
            });
        }
    }

    for (const grado of gradosSecundaria) {
        for (const seccion of secciones) {
            await prisma.seccion.create({
                data: {
                    gradoId: grado.id,
                    nombre: seccion,
                    capacidadMaxima: 35,
                    turno: turnos[Math.floor(Math.random() * turnos.length)],
                    profesorId: [profesor1.id, profesor2.id, profesor3.id][
                        Math.floor(Math.random() * 3)
                    ],
                },
            });
        }
    }

    console.log("Secciones creadas");

    const anioAcademico = await prisma.anioAcademico.create({
        data: {
            anio: 2025,
            esActivo: true,
        },
    });

    console.log("Año académico creado");

    const estudiante1 = await prisma.estudiante.create({
        data: {
            nombres: "Luis Alberto",
            apellidos: "Rodríguez Vega",
            dni: "78945612",
            fechaNacimiento: new Date("2010-03-15"),
            direccion: "Av. Los Pinos 123, Chiclayo",
            telefono: "987123456",
        },
    });

    const estudiante2 = await prisma.estudiante.create({
        data: {
            nombres: "Ana María",
            apellidos: "Díaz Castillo",
            dni: "78945613",
            fechaNacimiento: new Date("2011-07-22"),
            direccion: "Jr. Las Flores 456, Chiclayo",
            telefono: "987123457",
        },
    });

    const estudiante3 = await prisma.estudiante.create({
        data: {
            nombres: "Carlos Enrique",
            apellidos: "Mendoza Silva",
            dni: "78945614",
            fechaNacimiento: new Date("2009-11-08"),
            direccion: "Calle Los Robles 789, Chiclayo",
            telefono: "987123458",
        },
    });

    console.log("Estudiantes creados");

    const primeraSeccion = await prisma.seccion.findFirst({
        where: {
            grado: {
                nivelId: primaria.id,
                nombre: "1° Grado",
            },
            nombre: "A",
        },
    });

    if (primeraSeccion) {
        await prisma.matricula.create({
            data: {
                estudianteId: estudiante1.id,
                seccionId: primeraSeccion.id,
                anioAcademicoId: anioAcademico.id,
                estado: "activa",
            },
        });

        await prisma.matricula.create({
            data: {
                estudianteId: estudiante2.id,
                seccionId: primeraSeccion.id,
                anioAcademicoId: anioAcademico.id,
                estado: "activa",
            },
        });
    }

    const segundaSeccion = await prisma.seccion.findFirst({
        where: {
            grado: {
                nivelId: secundaria.id,
                nombre: "1° Año",
            },
            nombre: "A",
        },
    });

    if (segundaSeccion) {
        await prisma.matricula.create({
            data: {
                estudianteId: estudiante3.id,
                seccionId: segundaSeccion.id,
                anioAcademicoId: anioAcademico.id,
                estado: "activa",
            },
        });
    }

    console.log("Matrículas de ejemplo creadas");
    console.log("Seed completado exitosamente");
}

main()
    .catch((e) => {
        console.error("Error en el seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
