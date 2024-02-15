import { User } from "./User.js";
import { Event } from "./Event.js";

export interface OrderItem {
    event: Event,
    qty: number
}

export interface Order {
    date: Date,
    user: User,
    items: OrderItem[]
}
