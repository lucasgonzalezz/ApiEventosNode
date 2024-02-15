import { ObjectId } from "mongodb";
import { collections } from "../services/databaseService";

export class Event {
    public _id?: ObjectId;

    constructor(
        public title: string,
        public imageUrl: string,
        public description: string,
        public price: number,
        public id?: number
    ) {
        if(id) this._id = new ObjectId(id);
    }
    
    async save() {
        if (this._id) {
            const result = await collections.events?.updateOne({ _id: this._id }, { $set: this });
            result
                ? console.log(`Id del evento actualizado ${this._id}`)
                : console.log("No se ha podido crear el evento");
            return;
        } else {
            const result = await collections.events?.insertOne(this);
            result
                ? console.log(`Id del evento creado ${result.insertedId}`)
                : console.log("No se ha podido crear el evento");
        }

    };

    static async fetchAll() {
        return await collections.events?.find().toArray();
    };
    static async findById(eventId: string) {
        return await collections.events?.findOne({ _id: new ObjectId(eventId) });
    };

    static async deleteById(eventId: string) {
       return await collections.events?.deleteOne({_id: new ObjectId(eventId)});
    }
}