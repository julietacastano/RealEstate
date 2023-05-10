import {Property, Category, Price} from '../model/index.js'

const properties = async (req,res) =>{
    const properties = await Property.findAll({
        include:[
            {model:Category},
            {model:Price}
        ]
    })

    res.json(properties)
}

export{
    properties,
}