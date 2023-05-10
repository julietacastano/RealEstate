import {Op} from 'sequelize'
import {Property, Category, Price} from '../model/index.js'

//Home-----------------------------------------------------
const home = async (req,res) =>{
    const [categories, prices, houses, apartments] = await Promise.all([
        Category.findAll({raw:true}),
        Price.findAll({raw:true}),
        Property.findAll({
            limit:3,
            where: {
                categoryId:1,
                posted:true
            },
            include:[{model:Price}],
            order:[['createdAt', 'DESC']]
        }),
        Property.findAll({
            limit:3,
            where: {
                categoryId:2,
                posted:true
            },
            include:[{model:Price}],
            order:[['createdAt', 'DESC']]
        })
    ])

    res.render('home',{
        page:'Home',
        csrfToken: req.csrfToken(),
        categories,
        prices,
        houses,
        apartments
    })
}

//Filter categories -----------------------------------------------------
const categoriesFilter = async (req,res) =>{
    //Find category and see if it exists
    const {id} = req.params
    const category = await  Category.findByPk(id)

    if(!category){
        return res.redirect('/404')
    }

    //Bring all properties with that category
    const properties = await Property.findAll({
        where:{categoryId:id},
        include:[{model:Price}]
    })

    res.render('categories',{
        page:`${category.name}s for sale`,
        csrfToken: req.csrfToken(),
        properties
    })

}

//Not found 404 -----------------------------------------------------
const notFound = async (req,res) =>{
    res.render('404',{
        page:'404 - Not found'
    })
}

//Search -------------------------------------------------------------
const search = async (req,res) =>{
    const {search} = req.body

    //Validate seach not empty
    if(!search.trim()){
        return res.redirect('back')
    }

    //Bring properties from db
    const properties = await Property.findAll({
        where:{
            title:{
                [Op.like]: `%${search}%`  //"%" + search + '%'
            }
        },
        include:[{model:Price}]
    })

    res.render('search',{
        page:'Search results',
        csrfToken: req.csrfToken(),
        properties
    })

}

//Exports-----------------------------------------------------
export{
    home,
    categoriesFilter,
    notFound,
    search
}