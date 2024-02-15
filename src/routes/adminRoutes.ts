// Importar el enrutador desde Express y los controladores necesarios
import { Router } from "express";
import { getAddEvent, getAllOrders, getEditEvent, getEvents, postAddEvent, postDeleteEvent, putEditEvent } from "../controllers/adminCtrl";

// Crear un enrutador para las rutas relacionadas con la administración
export const adminRouter = Router();

// Definir las rutas y asignar los controladores correspondientes
adminRouter.get('/events', getEvents);
adminRouter.get('/add-event', getAddEvent);
adminRouter.post('/add-event', postAddEvent);
adminRouter.get('/add-event/:eventId', getEditEvent);
adminRouter.put('/edit-event', putEditEvent);
adminRouter.delete('/delete-event', postDeleteEvent);
adminRouter.get('/orders', getAllOrders);
