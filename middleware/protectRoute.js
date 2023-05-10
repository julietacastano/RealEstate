import Jwt from "jsonwebtoken"
import {User} from "../model/index.js"

const protectRoute = async (req,res,next) =>{
    const token = req.cookies._token

    //Check if there is a token
    if(!token){
        return res.redirect('/auth/login')
    }

    //Check the JWT
    try {
        const decoded = Jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.scope('deletePassword').findByPk(decoded.id)

        if(user){
            req.user = user
        }else{
            return res.redirect('/auth/login')
        }
        return next()

    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }
    
    next()
}

export default protectRoute