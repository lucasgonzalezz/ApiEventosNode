// Importar el enrutador desde Express y los controladores necesarios
import { Router } from "express";
import { getEventById, getEvents, getIndex } from "../controllers/shopCtrl";

// Crear un enrutador para las rutas relacionadas con la tienda
export const shopRouter = Router();

// Definir las rutas y asignar los controladores correspondientes
shopRouter.get('/', getIndex);
shopRouter.get('/events', getEvents);
shopRouter.get('/events/:eventId', getEventById);
