import { exit } from "node:process"
import db from "../config/db"
import colors from "colors"

//Limpiamos la tabla
const clearDB = async () => {
    try {
        //.sync({force: true}) --> Borra la tabla y crea una nueva.
        await db.sync({force:true})
        console.log( colors.bgGreen.white.bold("DB limpiada con éxito"))
        exit()
    } catch (error) {
        console.log(error);
        exit(1)
    }
}

//Al ejecutar el script "pretest" llamamos a la fn para limpiar la tabla.
if (process.argv[2] === "--clear") {
    clearDB()
}