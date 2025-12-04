// src/controladores/nivelControlador.ts
import { Request, Response } from 'express';
import { NivelServicio } from '../services/nivelServicio';
import { enviarRespuestaExito, enviarRespuestaError } from '../utils/respuesta';

export class NivelControlador {
  private nivelServicio: NivelServicio;

  constructor() {
    this.nivelServicio = new NivelServicio();
  }

  obtenerTodos = async (req: Request, res: Response): Promise<Response> => {
    try {
      const niveles = await this.nivelServicio.obtenerTodos();
      return enviarRespuestaExito(res, niveles, 'Niveles obtenidos exitosamente');
    } catch (error: any) {
      return enviarRespuestaError(res, 'Error al obtener niveles', error.message, 500);
    }
  };

  obtenerPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const nivel = await this.nivelServicio.obtenerPorId(Number(id));
      return enviarRespuestaExito(res, nivel, 'Nivel obtenido exitosamente');
    } catch (error: any) {
      return enviarRespuestaError(res, 'Error al obtener nivel', error.message, 404);
    }
  };

  crear = async (req: Request, res: Response): Promise<Response> => {
    try {
      const nivel = await this.nivelServicio.crear(req.body);
      return enviarRespuestaExito(res, nivel, 'Nivel creado exitosamente', 201);
    } catch (error: any) {
      return enviarRespuestaError(res, 'Error al crear nivel', error.message, 400);
    }
  };

  actualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const nivel = await this.nivelServicio.actualizar(Number(id), req.body);
      return enviarRespuestaExito(res, nivel, 'Nivel actualizado exitosamente');
    } catch (error: any) {
      return enviarRespuestaError(res, 'Error al actualizar nivel', error.message, 400);
    }
  };

  eliminar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const nivel = await this.nivelServicio.eliminar(Number(id));
      return enviarRespuestaExito(res, nivel, 'Nivel eliminado exitosamente');
    } catch (error: any) {
      return enviarRespuestaError(res, 'Error al eliminar nivel', error.message, 400);
    }
  };
}