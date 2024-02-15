import { Request, Response, NextFunction } from "express";
import { Event } from "../models/Event";

export const getEvents = async (req: Request, res: Response) => {
    const events = await Event.fetchAll();
    res.json(events);
};

export const getAddEvent = (req: Request, res: Response, next: NextFunction) => {
    console.log("Devolvemos el formulario para meter eventos");
    res.json({ pageTitle: "Formulario", path: "/admin/add-event", editing: false });
};

export const postAddEvent = async (req: Request, res: Response, next: NextFunction) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    console.log(description);
    const price = +req.body.price;
    if (req.body.title) {
        console.log('Ha llegado el siguiente evento: ', req.body.title);
        const evento = new Event(
            title,
            imageUrl,
            description,
            price
        );
        await evento.save(); 
        res.json(evento);
    }
    console.log('pasa');
   
};

export const getEditEvent = async (req: Request, res: Response, next: NextFunction) => {
    console.log("getEditEvent: Devolvemos el formulario para editar eventos");
    const editMode = req.query.edit === 'true';
    try {
        if (!editMode) {
            return res.status(400).json({ error: 'Missing edit query parameter or not set to true' });
        }
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        console.error("Error al obtener evento para editar:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const putEditEvent = async (req: Request, res: Response, next: NextFunction) => {
    console.log("putEditEvent");
    
    const { title, imageUrl, description, price, _id } = req.body;
    const event = new Event(title, imageUrl, description, price, _id );

    console.log(event);
    
    await event.save();

    return res.json(event);
};

// Función delete
export const postDeleteEvent = (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.body._id;

    Event.deleteById(eventId);

    return res.json(eventId+ " deleted");

};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const orders = await user.getOrders();
    res.json(orders);
};

