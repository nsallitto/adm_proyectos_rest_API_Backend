import express from "express"
import router from "./router"
import cors, { CorsOptions } from "cors"
import morgan from "morgan"
import db from "./config/db"
import colors from "colors"

//Conectar a Base de Datos
async function connectDB() {
    try {
        await db.authenticate();
        db.sync();
        // console.log(colors.blue.bold('Conexion Exitosa a la DB'));
        
    } catch (error) {
        console.log( colors.red.bold('Hubo un error con la conexion a la DB') );
    }
}
connectDB()

//instancia express - creamos el server
const server = express();

//permitimos conexiones (CORS)
const corsOption: CorsOptions = {
    origin: function(origin, callback) {
        if(origin === process.env.FRONTEND_URL){
            callback(null, true)

        } else {
            callback(new Error("Error de CORS"))
            
        }
        
    }
}
server.use(cors(corsOption))

//leer datos de formuario
server.use(express.json())

//leemos info con morgan
server.use(morgan("dev"))

server.use('/api/products', router);

export default server;