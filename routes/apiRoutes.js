import Express from "express";
import { properties } from "../controllers/apiController.js";

const apiRoutes = Express.Router()

apiRoutes.get('/properties', properties)

export default apiRoutes