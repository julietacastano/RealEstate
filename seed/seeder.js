import db from "../config/db.js";
import categories from "./categories.js";
import prices from "./prices.js";
import users from "./Users.js";
import {Category, Price, User} from "../model/index.js"

const importData = async () =>{
    try {
        //Authenticate database
        await db.authenticate()

        //Generate columns in database
        await db.sync()

        //Insert data in columns
        //Uso promise all cuando los dos comandos pueden correr juntos, es decir, no dependen uno del otro
        await Promise.all([ 
            Category.bulkCreate(categories),
            Price.bulkCreate(prices),
            User.bulkCreate(users)
        ])
        console.log('Successful data import')
        process.exit() //Sin nada o con un 0 cuento se hizo correctamente
    } catch (error) {
        console.log(error)
        process.exit(1) //Se pone 1 cuando sale con error
    }
}

const deleteData = async () =>{
    try {
        await db.sync({force:true})
        console.log('successfuly data delete')
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

if (process.argv[2] === "-i"){
    importData()
}

if (process.argv[2] === "-d"){
    deleteData()
}