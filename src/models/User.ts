// Importar ObjectId desde MongoDB, la colección de la base de datos y modelos relacionados
import { ObjectId } from "mongodb";
import { collections } from "../services/databaseService.js";
import { Order, OrderItem } from "./Order.js";
import { Event } from "./Event.js";

// Definir la interfaz para la dirección
interface Address {
    calle: string,
    telf: string,
    CP: string
}

// Definir la interfaz para un elemento del carrito
export interface CartItem {
    pid: ObjectId,
    qty: number
}

// Clase que representa un usuario
export class User {
    public _id?: ObjectId;
    public cart: CartItem[] = [];

    constructor(
        public DNI: string,
        public name: string,
        public mail: string,
        public contacto: Address,
        cart?: CartItem[],
        id?: string
    ) {
        if (id) this._id = new ObjectId(id);
        cart ? this.cart = cart : this.cart = [];
    }

    // Método para guardar un usuario en la base de datos
    async save() {
        const result1 = await collections.users?.findOne({ DNI: this.DNI });
        if (result1) {
            this._id = result1._id;
            return this;
        }

        const result = await collections.users?.insertOne(this);
        console.log(result);
        result
            ? console.log(`Id del usuario creado: ${result.insertedId}`)
            : console.log("No se ha podido crear el usuario");
        return this;
    }

    // Método estático para obtener un usuario por su ID
    static async fetchById(id: string) {
        return await collections.users?.findOne({ _id: new ObjectId(id) });
    }

    // Método para agregar un evento al carrito del usuario
    async addToCart(id: string) {
        const index = this.cart.findIndex(c => c.pid.toHexString() === id);
        if (index >= 0) {
            this.cart[index].qty += 1;
        } else {
            const eventId = new ObjectId(id);
            this.cart.push({ pid: eventId, qty: 1 });
        }
        return await collections.users?.updateOne({ _id: this._id }, { $set: { cart: this.cart } });
    }

    // Método para obtener el contenido del carrito del usuario
    async getCart() {
        const eventsIds = this.cart.map(ci => ci.pid);
        const events = await collections.events?.find({ _id: { $in: eventsIds } }).toArray();

        return events?.map(e => {
            const qty = this.cart.find(ci => e._id.toHexString() === ci.pid.toHexString())?.qty;
            return {
                id: e._id,
                title: e.title,
                price: e.price,
                qty: qty
            }
        });
    }

    // Método para eliminar un elemento del carrito del usuario
    async deleteCartItem(id: string) {
        const index = this.cart.findIndex(c => c.pid.toHexString() === id);
        if (index >= 0) {
            this.cart.splice(index, 1);
            return await collections.users?.updateOne({ _id: this._id }, { $set: { cart: this.cart } });
        }
    }

    // Método para agregar una orden basada en el contenido del carrito
    async addOrder() {
        if (this.cart.length > 0 && this._id) {
            const eventsId = this.cart.map(ci => ci.pid); 
            const events = await collections.events?.find({ _id: { $in: eventsId } }).toArray();
            if (events) {
                const items: OrderItem[] = events.map(e => {
                    const qty = this.cart.find(ci => ci.pid.toHexString() === e._id.toHexString())!.qty;
                    return {
                        event: e as Event, // Convertir el tipo a Event
                        qty: qty
                    };
                })
                const time = new Date();
                this.cart = [];
                const result = await collections.users!.updateOne({ _id: this._id }, { $set: { cart: [] } });
                result
                    ? console.log('UpdateCart: ', result)
                    : console.log('Cart no vaciado');
                const newOrder: Order = { user: this, date: time, items: items};
                return await collections.orders?.insertOne(newOrder);
            }
        } else {
            return null;
        }
    }

    // Método para obtener todas las órdenes del usuario
    async getOrders() {
        return await collections.orders?.find({ 'user._id': this._id }).toArray();
    }
}