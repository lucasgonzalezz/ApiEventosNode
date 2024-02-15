// Importar las bibliotecas necesarias
import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';

// Importar modelos personalizados
import { Event } from '../models/Event.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';

// Crear un objeto para almacenar las colecciones de la base de datos
export const collections: {
    events?: mongoDB.Collection<Event>,
    users?: mongoDB.Collection<User>,
    orders?: mongoDB.Collection<Order>
} = {}

// Función para conectar a la base de datos
export async function connectToDatabase() {
    dotenv.config();

    // Crear una instancia del cliente MongoDB utilizando la cadena de conexión del entorno
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);

    // Conectar al cliente a la base de datos
    await client.connect();

    // Obtener la instancia de la base de datos utilizando el nombre de la base de datos del entorno
    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    // Asignar las colecciones a objetos en el objeto 'collections' utilizando los nombres de colecciones del entorno
    collections.events = db.collection<Event>(process.env.EVENT_COLLECTION!);
    collections.users = db.collection<User>(process.env.USER_COLLECTION!);
    collections.orders = db.collection<Order>(process.env.ORDER_COLLECTION!);

    // Mostrar información de conexión en la consola
    console.log(`Conectado a la BBDD: ${db.databaseName} y la colección: ${collections.events.collectionName}`);
    console.log(`Conectado a la BBDD: ${db.databaseName} y la colección: ${collections.users.collectionName}`);
    console.log(`Conectado a la BBDD: ${db.databaseName} y la colección: ${collections.orders.collectionName}`);
}