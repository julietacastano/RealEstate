import Express from "express";
import { home, categoriesFilter, notFound, search } from "../controllers/appController.js";

const appRoutes = Express.Router()

appRoutes.get('/', home)

//Filter categories
appRoutes.get('/category/:id', categoriesFilter)

//Not found
appRoutes.get('/404', notFound)

//Search engine
appRoutes.post('/search', search)

export default appRoutes