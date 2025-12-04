// src/configuracion/variables.ts
import dotenv from "dotenv";

dotenv.config();

export const configuracion = {
    puerto: process.env.PORT || 3000,
    entorno: process.env.NODE_ENV || "development",
    urlBaseDatos: process.env.DATABASE_URL || "",
};
