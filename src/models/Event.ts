// Importar ObjectId desde MongoDB y la colección de la base de datos
import { ObjectId } from "mongodb";
import { collections } from "../services/databaseService";

// Clase que representa un evento
export class Event {
    public _id?: ObjectId;

    constructor(
        public title: string,
        public imageUrl: string,
        public description: string,
        public price: number,
        public id?: number
    ) {
        // Asignar un nuevo ObjectId si se proporciona un id al constructor
        if (id) this._id = new ObjectId(id);
    }
    
    // Método para guardar un evento en la base de datos
    async save() {
        if (this._id) {
            const result = await collections.events?.updateOne({ _id: this._id }, { $set: this });
            result
                ? console.log(`Id del evento actualizado: ${this._id}`)
                : console.log("No se ha podido actualizar el evento");
            return;
        } else {
            const result = await collections.events?.insertOne(this);
            result
                ? console.log(`Id del evento creado: ${result.insertedId}`)
                : console.log("No se ha podido crear el evento");
        }
    };

    // Método estático para obtener todos los eventos
    static async fetchAll() {
        return await collections.events?.find().toArray();
    };

    // Método estático para encontrar un evento por su ID
    static async findById(eventId: string) {
        return await collections.events?.findOne({ _id: new ObjectId(eventId) });
    };

    // Método estático para eliminar un evento por su ID
    static async deleteById(eventId: string) {
       return await collections.events?.deleteOne({ _id: new ObjectId(eventId) });
    }
}