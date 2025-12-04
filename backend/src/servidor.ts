// src/servidor.ts
import { crearAplicacion } from "./aplicacion";
import { configuracion } from "./configuracion/variables";
import {
    conectarBaseDatos,
    desconectarBaseDatos,
} from "./configuracion/baseDatos";

const iniciarServidor = async (): Promise<void> => {
    try {
        await conectarBaseDatos();

        const app = crearAplicacion();

        const servidor = app.listen(configuracion.puerto, () => {
            console.log(
                `Servidor ejecutándose en el puerto ${configuracion.puerto}`
            );
            console.log(`Entorno: ${configuracion.entorno}`);
        });

        const manejarCierre = async (): Promise<void> => {
            console.log("\nCerrando servidor...");
            await desconectarBaseDatos();
            servidor.close(() => {
                console.log("Servidor cerrado");
                process.exit(0);
            });
        };

        process.on("SIGTERM", manejarCierre);
        process.on("SIGINT", manejarCierre);
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1);
    }
};

iniciarServidor();
