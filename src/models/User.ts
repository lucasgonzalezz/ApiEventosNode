import { ObjectId } from "mongodb";
import { collections } from "../services/databaseService.js";
import { title } from "node:process";
import { Order, OrderItem } from "./Order.js";
import { Event } from "./Event.js";

interface address {
    calle: string,
    telf: string,
    CP: string
}

export interface CartItem {
    pid: ObjectId,
    qty: number

}

export class User {
    public _id?: ObjectId
    public cart: CartItem[] = [];

    constructor(
        public DNI: string,
        public name: string,
        public mail: string,
        public contacto: address,
        cart?: CartItem[],
        id?: string
    ) {
        if (id) this._id = new ObjectId(id);
        cart ? this.cart = cart : this.cart = [];
    }

    async save() {
        const result1 = await collections.users?.findOne({ DNI: this.DNI });
        if (result1) {
            this._id = result1._id;
            return this;
        }

        const result = await collections.users?.insertOne(this);
        console.log(result);
        result
            ? console.log(`Id del user creado ${result.insertedId}`)
            : console.log("No se ha podido crear el usuario");
        return this;
    }

    static async fetchById(id: string) {
        return await collections.users?.findOne({ _id: new ObjectId(id) });
    }
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

    async deleteCartItem(id: string) {
        const index = this.cart.findIndex(c => c.pid.toHexString() === id);
        if (index >= 0) {
            this.cart.splice(index, 1);
            return await collections.users?.updateOne({ _id: this._id }, { $set: { cart: this.cart } });
        }
    }

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

    async getOrders() {
        return await collections.orders?.find({ 'user._id': this._id }).toArray();
    }
}