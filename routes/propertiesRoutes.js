import Express from "express";
import { body } from "express-validator";
import {admin, createPost, savePost, uploadImg, saveImg, changeStatus, edit, saveChanges, deleteProp, showProps, sendMessage, viewMessages} from "../controllers/propertiesController.js"
import protectRoute from "../middleware/protectRoute.js";
import identifyUser from "../middleware/identifyUser.js";
import upload from "../middleware/uploadImg.js";

const propsRouter = Express.Router()

propsRouter.get('/my-properties', protectRoute, admin )
propsRouter.get('/properties/post', protectRoute, createPost )
propsRouter.post('/properties/post', protectRoute, 
    body('title').notEmpty().withMessage('Title cannot be empty'),
    body('description').notEmpty().withMessage('Description cannot be empty'),
    body('category').isNumeric().withMessage('Please choose a category'),
    body('price').isNumeric().withMessage('Please choose a price range'),
    body('rooms').isNumeric().withMessage('Please choose the number of rooms'),
    body('parking').isNumeric().withMessage('Please choose the number of parking spots'),
    body('bath').isNumeric().withMessage('Please choose the number of bathrooms'),
    body('lat').notEmpty().withMessage('Please locate the property on the map'),
    savePost
)

propsRouter.get('/properties/add-img/:id',protectRoute, uploadImg)
propsRouter.post('/properties/add-img/:id',
    protectRoute,
    upload.single('image'),
    saveImg
)

propsRouter.put('/properties/:id', protectRoute, changeStatus)

propsRouter.get('/properties/edit/:id',protectRoute, edit)
propsRouter.post('/properties/edit/:id', protectRoute, 
    body('title').notEmpty().withMessage('Title cannot be empty'),
    body('description').notEmpty().withMessage('Description cannot be empty'),
    body('categoryId').isNumeric().withMessage('Please choose a category'),
    body('priceId').isNumeric().withMessage('Please choose a price range'),
    body('rooms').isNumeric().withMessage('Please choose the number of rooms'),
    body('parking').isNumeric().withMessage('Please choose the number of parking spots'),
    body('bath').isNumeric().withMessage('Please choose the number of bathrooms'),
    body('lat').notEmpty().withMessage('Please locate the property on the map'),
    saveChanges
)

propsRouter.post('/properties/delete/:id', protectRoute, deleteProp)

//Public properties
propsRouter.get('/properties/:id', 
    identifyUser,    
    showProps
)

//Message
propsRouter.post('/properties/:id', 
    identifyUser,
    body('message').isLength({min:20}).withMessage('The message is too short'),   
    sendMessage
)
propsRouter.get('/message/:id',protectRoute, viewMessages)


export default propsRouter