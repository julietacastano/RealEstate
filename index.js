import Express from "express";
import csrf from "csurf"
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import propsRoutes from "./routes/propertiesRoutes.js";
import appRoutes from "./routes/appRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import db from "./config/db.js";

//Create app
const app = Express()

//enable form
app.use(Express.urlencoded({extended:true}))

//Enable cookie parser
app.use(cookieParser())

//Enable CSRF
app.use(csrf({cookie:true}))

//Connection to dabatabase
try{
    await db.authenticate();
    db.sync()
}catch(error){
    console.log(error)
}

//pug
app.set('view engine', 'pug')
app.set('views', './views')

//public folder
app.use(Express.static('public'))

//Routing   
app.use('/', appRoutes)
app.use('/auth', userRoutes)
app.use('/', propsRoutes)
app.use('/api', apiRoutes)

//Define port and inicialize proyect
const port = process.env.PORT || 3000;
app.listen(port, ()=>{console.log(`Listening port ${port}`)})