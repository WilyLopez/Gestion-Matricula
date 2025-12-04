// src/configuracion/baseDatos.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

export const conectarBaseDatos = async (): Promise<void> => {
    try {
        await prisma.$connect();
        console.log("Base de datos conectada exitosamente");
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        process.exit(1);
    }
};

export const desconectarBaseDatos = async (): Promise<void> => {
    await prisma.$disconnect();
    console.log("Base de datos desconectada");
};
