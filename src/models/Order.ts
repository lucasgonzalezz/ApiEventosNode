// Importar las clases necesarias
import { User } from "./User.js";
import { Event } from "./Event.js";

// Definir la interfaz para un elemento de orden
export interface OrderItem {
    event: Event,
    qty: number
}

// Definir la interfaz para una orden
export interface Order {
    date: Date,
    user: User,
    items: OrderItem[]
}