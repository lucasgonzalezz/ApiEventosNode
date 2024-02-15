// Importar las bibliotecas y módulos necesarios
import express, { urlencoded } from "express";
import * as dotenv from 'dotenv';

// Importar rutas, servicios y modelos personalizados
import { adminRouter } from "./routes/adminRoutes.js";
import { shopRouter } from "./routes/shopRoutes.js";
import { collections, connectToDatabase } from "./services/databaseService.js";
import { User } from "./models/User.js";

// Configurar variables de entorno y obtener el puerto del proceso o usar el puerto 3000 por defecto
console.log('--------------------------------------------------------------');
console.log("API de Eventos de Lucas González");
dotenv.config();
const port = process.env.PORT || 3000;

// Inicializar la aplicación Express
const app = express();

// Conectar a la base de datos y realizar algunas operaciones iniciales
connectToDatabase()
    .then(async () => {
        // Crear y guardar un usuario de ejemplo en la base de datos (Lucas González)
        const user = new User('456324715', 'Lucas', 'lucas@gmail.com', { calle: 'Font Calent', telf: '640352458', CP: '46028' });
        await user.save();
    })
    .then(() => {
        console.log('¡Funciona!');

        // Configurar middleware y ajustes de la aplicación Express
        app.use(urlencoded({ extended: false })); 
        app.use(express.json());
        app.disable('x-powered-by');
        app.set('view engine', 'ejs');

        // Middleware para obtener un usuario de la base de datos y adjuntarlo al objeto de solicitud (req)
        app.use(
            async (req, res, next) => {
                const user = await collections.users?.findOne({ 'DNI': '456324715' });
                req.body.user = new User(user!.DNI, user!.name, user!.mail, user!.contacto, user!.cart, user!._id.toHexString());
                next();
            }
        );

        // Configurar rutas para la administración y la tienda
        app.use('/admin', adminRouter); 
        app.use('/', shopRouter);

        // Middleware para manejar rutas no definidas
        app.use('*', (req, res, next) => {
            console.log("Middleware del final");
            res.status(404).json("Not Found");
        });

        // Iniciar el servidor y mostrar información en la consola
        app.listen(port);
        console.log("Servidor de la aplicación en marcha");
        console.log(`Página disponible en: http://localhost:${port}`);
    })
    .catch((error) => {
        console.log(error);
    });

console.log('----- Fin de la API de Eventos de Lucas González -----');