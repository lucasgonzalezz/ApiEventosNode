// Importar las clases y tipos necesarios de Express y los modelos User y Event
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { Event } from "../models/Event";

// Controlador para la página principal
export const getIndex = (req: Request, res: Response, next: NextFunction) => {
    res.json({ pageTitle: 'Tienda', path: '/' });
};

// Controlador para obtener todos los eventos
export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
    const events = await Event.fetchAll();
    res.json(events);
};

// Controlador para obtener un evento por su ID
export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ pageTitle: 'Evento no encontrado', path: '' });
    }
};

// Controlador para obtener el contenido del carrito de un usuario
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user as User;
    const items = await user.getCart();
    res.json(items);
};

// Controlador para agregar un evento al carrito de un usuario
export const postCart = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const eventId = req.body.eventId;
    await user.addToCart(eventId);
    res.json(eventId + " added");
};

// Controlador para eliminar un elemento del carrito de un usuario
export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const eventId = req.body.eventId;
    await user.deleteCartItem(eventId);
    res.json(eventId + " deleted");
};

// Controlador para obtener todas las órdenes de un usuario
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const orders = await user.getOrders();
    res.json(orders);
};

// Controlador para realizar el proceso de pago y crear una nueva orden
export const getCheckOut = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    try {
        const result = await user.addOrder();
        result
            ? console.log('Orden añadida: ', result)
            : console.log('Error en la orden');
        return res.json(result);
    } catch (error) {
        console.log(error);
    } 
};