import { validationResult } from "express-validator"
import {unlink} from "node:fs/promises"
import {Price, Category, Property, Message, User} from "../model/index.js"
import { isSeller, formatDate } from "../helpers/indexHelper.js"

//Admin panel-------------------------------------------------------------------
const admin = async (req,res) => {
    const {page: currentPage} = req.query
    const redex = /^[0-9]$/
    if(!redex.test(currentPage)){
        return res.redirect('/my-properties?page=1')
    }

    try {
        const {id} = req.user // = req.user.id
        const limit = 3
        const offset = ((currentPage * limit) - limit)

        const [properties, total] = await Promise.all([
            Property.findAll({
                limit,
                offset,
                where:{userId:id},
                include:[
                    {model:Category},
                    {model:Price},
                    {model:Message}
                ]
            }),
            Property.count({
                where:{userId:id}
            })
        ])

        res.render('properties/admin-props',{
            page:'My properties',
            csrfToken: req.csrfToken(),
            properties,
            pages:Math.ceil(total/limit),
            currentPage: Number(currentPage) ,
            limit,
            offset,
            total
        })

    } catch (error) {
        console.log(error)
    }

}

//Form to create property---------------------------------------------------------
const createPost = async (req, res) => {
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render('properties/post',{
        page:'Post a property',
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: {}
    })
}
//Save the property----------------------------------------------------------------------
const savePost = async (req,res)=>{
    //Check validation
    let result = validationResult(req)
    
    //Render errors
    if(!result.isEmpty()){
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
        return res.render('properties/post',{
            page:'Post a property',
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })
    }

    //Create an entry
    const {title, description, category, price, rooms, parking, bath, address, lat, lng } = req.body
    const userId = req.user.id
    try {
        const propSave = await Property.create({
            title,
            description,
            categoryId:category,
            priceId:price,
            rooms,
            parking,
            bath,
            address,
            lat,
            lng,
            userId,
            img:''
        })

        res.redirect(`/properties/add-img/${propSave.id}`)

    } catch (error) {
        console.log(error)
    }
}
//Upload images-------------------------------------------------------------------------------
const uploadImg = async(req,res) =>{
    //Find property in database to see if it exists
    const {id} = req.params
    const prop = await Property.findByPk(id)

    //Validations
    if(!prop){
        return res.redirect('/my-properties')
    }
    if(prop.posted){
        return res.redirect('/my-properties')
    }
    
    //Check user logged is user who posted the property
    const loggedUserId = req.user.id.toString()
    const propUserId = prop.userId.toString()
    if(loggedUserId !== propUserId){
        return res.redirect('/my-properties')
    }

    res.render('properties/add-img', {
        page:`Upload images ${prop.title}`,
        csrfToken: req.csrfToken(),
        prop
    })
}
//Save images-------------------------------------------------------------------------------
const saveImg = async (req,res,next) =>{
    //Find property in database
    const {id} = req.params
    const prop = await Property.findByPk(id)
    
    //Check property exist
    if(!prop){
        return res.redirect('/my-properties')
    }
    if(prop.posted){
        return res.redirect('/my-properties')
    }
    
    //Check user logged is user who posted the property
    const loggedUserId = req.user.id.toString()
    const propUserId = prop.userId.toString()
    if(loggedUserId !== propUserId){
        return res.redirect('/my-properties')
    }

    try {
        prop.img = req.file.filename
        prop.posted = 1

        await prop.save()
        
        next()
        
    } catch (error) {
        console.log(error)
    }
}
//Change status of a property ---------------------------------------------------------------------
const changeStatus = async (req,res) =>{
    //Find prop in database and check if it exists
    const {id} = req.params
    const prop = await Property.findByPk(id)
    if(!prop){
        return res.redirect('/my-properties')
    }
    
    //Check user logged is user who posted the property
    const loggedUserId = req.user.id.toString()
    const propUserId = prop.userId.toString()
    if(loggedUserId !== propUserId){
        return res.redirect('/my-properties')
    }

    //Update status
    prop.posted = !prop.posted
    await prop.save()

    res.json({
        result:true
    })    
}

//Form edit the property ---------------------------------------------------------------------------
const edit = async (req,res) =>{
    //Find property in database
    const {id} = req.params
    const prop = await Property.findByPk(id)
    
    //Check property exist
    if(!prop){
        return res.redirect('/my-properties')
    }
    
    //Check user logged is user who posted the property
    const loggedUserId = req.user.id.toString()
    const propUserId = prop.userId.toString()
    if(loggedUserId !== propUserId){
        return res.redirect('/my-properties')
    }

    
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render('properties/edit',{
        page:`Edit property: "${prop.title}"`,
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: prop
    })
}
//Save changes -----------------------------------------------------------------------------
const saveChanges = async (req,res) =>{
    //Find property in database
    const {id} = req.params
    const prop = await Property.findByPk(id)
    
    //Validations
    let result = validationResult(req)
    
    if(!result.isEmpty()){
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
        return res.render('properties/edit',{
            page:`Edit property: "${prop.title}"`,
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })
    }

    //Check property exists
    if(!prop){
        return res.redirect('/my-properties')
    }

    //Check user logged is user who posted the property
    const loggedUserId = req.user.id.toString()
    const propUserId = prop.userId.toString()
    if(loggedUserId !== propUserId){
        return res.redirect('/my-properties')
    }

    try {
        const {title, description, categoryId, priceId, rooms, parking, bath, address, lat, lng } = req.body
        prop.set({
            title,
            description,
            categoryId,
            priceId,
            rooms,
            parking,
            bath,
            address,
            lat,
            lng,
        })
        await prop.save()

        res.redirect('/my-properties')
    } catch (error) {
        console.log(error)
    }
}

//Delete a property --------------------------------------------------------------------------
const deleteProp = async (req,res) => {
    //Find prop in database and check if it exists
    const {id} = req.params
    const prop = await Property.findByPk(id)
    if(!prop){
        return res.redirect('/my-properties')
    }
    
    //Check user logged is user who posted the property
    const loggedUserId = req.user.id.toString()
    const propUserId = prop.userId.toString()
    if(loggedUserId !== propUserId){
        return res.redirect('/my-properties')
    }

    //Delete images  
    await unlink(`public/uploads/${prop.img}`)

    //Delete property
    await prop.destroy()
    res.redirect('/my-properties')
}

//Show public properties -------------------------------------------------------------------
const showProps = async (req,res) =>{
    //Find property in database
    const {id} = req.params
    
    const prop = await Property.findByPk(id,{
        include:[
            {model:Category},
            {model:Price}
        ]
    })

    //Check property exists
    if(!prop || !prop.posted){
        return res.redirect('/404')
    }

    const seller = isSeller(req.user?.id,prop.userId)

    res.render('properties/show-props',{
        page:prop.title,
        csrfToken: req.csrfToken(),
        prop,
        user:req.user,
        seller
    })
}

//Send message -------------------------------------------------------------------
const sendMessage = async (req,res) =>{
        //Find property in database
        const {id} = req.params
        const prop = await Property.findByPk(id,{
            include:[
                {model:Category},
                {model:Price}
            ]
        })
    
        //Check property exists
        if(!prop){
            return res.redirect('/404')
        }
    
        const seller = isSeller(req.user?.id,prop.userId)
        
        //validate errors 
        let result = validationResult(req)
        if(!result.isEmpty()){
            res.render('properties/show-props',{
                page:prop.title,
                csrfToken: req.csrfToken(),
                prop,
                user:req.user,
                seller,
                errors:result.array()
            })
        }

        const {message} = req.body
        const userId = req.user.id
        const propertyId = req.params.id

        await Message.create({
            message,
            userId,
            propertyId
        })


        res.redirect('/')
    
}
//See messages--------------------------------------------------------
const viewMessages = async (req,res) => {
    //Find property in database
    const {id} = req.params
    const prop = await Property.findByPk(id,{
        include:[
            {model:Message,
                include:[
                    {model:User.scope('deletePassword')},
                ]
            },
        ]
    })

    if(!prop){
        res.redirect('/my-properties')
    }
    //Check user logged is user who posted the property
    const loggedUserId = req.user.id.toString()
    const propUserId = prop.userId.toString()
    if(loggedUserId !== propUserId){
        return res.redirect('/my-properties')
    }
    
    res.render('properties/message',{
        page:'Messages',
        messages:prop.messages,
        formatDate
    })

}

//Exports -----------------------------------------------------------------------------------
export{
    admin,
    createPost,
    savePost,
    uploadImg,
    saveImg,
    changeStatus,
    edit,
    saveChanges,
    deleteProp,
    showProps,
    sendMessage,
    viewMessages
}