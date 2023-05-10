import { check, validationResult } from "express-validator"
import bcyrpt from 'bcrypt'
import User from "../model/User.js"
import { idGenerator, jwtGenerator } from "../helpers/tokens.js"
import { registerEmail, forgotPasswordEmail } from "../helpers/emails.js"

//Render login----------------------------------------------------------------------------------------
const formioLogin = (req,res) => {
    res.render('auth/login',{
        page:'Sign in',
        csrfToken: req.csrfToken()
    })
}
const authentication = async (req,res)=>{
    await check('email').isEmail().withMessage('Email cannot be empty').run(req)
    await check('password').notEmpty().withMessage('Password cannot be empty').run(req)

    let result = validationResult(req)

    //Render validations
    if(!result.isEmpty()){
        return res.render('auth/login', {
                page: 'Sign in',
                csrfToken: req.csrfToken(),
                errors: result.array(),
            })
        }

    //Check user found
    const userFound = await User.findOne({where:{email:req.body.email}})
    if(!userFound){
        return res.render('auth/login', {
            page: 'Sign in',
            csrfToken: req.csrfToken(),
            errors:[{msg:"This email doesn't belong to an active user"}]
        })
    }

    //Check confirmation
    if(!userFound.confirm){
        return res.render('auth/login', {
            page: 'Sign in',
            csrfToken: req.csrfToken(),
            errors:[{msg:'User confirmation pending. Plase check your email'}]
        })
    }

    //Check password
    if(!userFound.checkPassword(req.body.password)){
        return res.render('auth/login', {
            page: 'Sign in',
            csrfToken: req.csrfToken(),
            errors:[{msg:'Password incorrect'}]
        })
    }

    //Authenticate user
    const token = jwtGenerator({id:userFound.id, name: userFound.name})
    return res.cookie('_token', token, {
        httpOnly: true,
    }).redirect('/my-properties')
}

//Log out ---------------------------------------------------------------------------------------------
const logout = (req,res) =>{
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

//Render Register---------------------------------------------------------------------------------------
const formRegister = (req,res) => {
    res.render('auth/register', {
        page: 'Sign up',
        csrfToken: req.csrfToken()
    })
}
const register = async (req,res) => { 
    //validation
    await check('name').notEmpty().withMessage('Name cannot be empty').run(req)
    await check('email').isEmail().withMessage('That is not an email').run(req)
    await check('password').isLength({min:6}).withMessage('The password is too short').run(req)
    await check('repeatPassword').equals(req.body.password).withMessage('The password are not the same').run(req)

    let result = validationResult(req)

    //Render validations
    if(!result.isEmpty()){
        return res.render('auth/register', {
                page: 'Sign up',
                csrfToken: req.csrfToken(),
                errors: result.array(),
                user:{
                    name:req.body.name,
                    email:req.body.email,
                }
            })
    }

    //Check user repetition
    const userUsed = await User.findOne({where: {email:req.body.email}})
    if (userUsed){
        return res.render('auth/register', {
            page: 'Sign up',
            csrfToken: req.csrfToken(),
            errors: [{msg:'An account already exists with the email address'}],
            user:{
                name:req.body.name,
                email:req.body.email,
            }
        })
    }

    //Create user in database
    const user = await User.create({
        ...req.body,
        token: idGenerator()
    })

    //Mail
    registerEmail({
        name:user.name,
        email:user.email,
        token:user.token
    })

    res.render('templates/message', {
        page: 'Account created successfully',
        message:'Please confirm your email address to finish your account creation process'
    })
}

//Render confirmation email------------------------------------------------------------------------
const confirmation = async (req,res) =>{
    const {token} = req.params
    const userConfirm = await User.findOne({where: {token}})

    //Error confirmation 
    if(!userConfirm){
        return res.render('auth/confirmation-acc',{
            page: 'Error in creating account',
            message:'Error occurred while confirming your account. Please try again',
            error: true
        })
    }

    //Confirmarion ok
    userConfirm.token = null;
    userConfirm.confirm = true;
    await userConfirm.save();

    res.render('auth/confirmation-acc',{
        page: 'Your registration is completed ',
        message:'Congratulations! Your account is ready to use ',
    })    
}

//Render forgot Password ----------------------------------------------------------------------------
const formForgotPassword = (req,res) => {
    res.render('auth/forgot-password', {
        page: 'Password assistance',
        csrfToken: req.csrfToken(),
    })
}

const resetPassword = async (req,res) => {
    //validation
    await check('email').isEmail().withMessage('That is not an email').run(req)

    let result = validationResult(req)

    //Render validations
    if(!result.isEmpty()){
        return res.render('auth/forgot-password', {
                page: 'Password assistance',
                csrfToken: req.csrfToken(),
                errors: result.array(),
            })
    }
    
    //Search user
    const userFound = await User.findOne({where: {email:req.body.email}})

    if(!userFound){
        return res.render('auth/forgot-password', {
            page: 'Password assistance',
            csrfToken: req.csrfToken(),
            errors: [{msg: "This email doesn't belong to an active user"}],
        })
    }

    //Generate new token 
    userFound.token = idGenerator()
    await userFound.save()

    //Mail
    forgotPasswordEmail({
        name:userFound.name,
        email:userFound.email,
        token:userFound.token
    })
    res.render('templates/message', {
        page: 'Reset password',
        message:'Please follow the instructions sent to your email to reset your password'
    })
}

const confirmNewToken = async (req, res) =>{
    const {token} = req.params
    const userFoundToken = await User.findOne({where: {token}})
    if(!userFoundToken){
        return res.render('auth/confirmation-acc',{
            page: 'Error in reseting password',
            message:'Error occurred while reseting your password.Please try again',
            error: true
        })
    }

    res.render('auth/reset-password',{
        page: 'Reset your password',
    })
}

const newPassword = async (req,res) =>{
    await check('password').isLength({min:6}).withMessage('The password is too short').run(req)

    let result = validationResult(req)

    //Render validations
    if(!result.isEmpty()){
        return res.render('auth/reset-password', {
                page: 'Reset your password',
                csrfToken: req.csrfToken(),
                errors: result.array(),
            })
    }

    const {token} = req.params
    const userFound = await User.findOne({where: {token}})

    const salt = await bcyrpt.genSalt(10)
    userFound.password = await bcyrpt.hash(req.body.password, salt)
    userFound.token = null

    await userFound.save()

    return res.render('auth/confirmation-acc',{
        page: 'Password reseted correctly',
        message:'Congratulations! Your account is ready to use',
    })

}

//exports-------------------------------------------------------------------------------------
export{
    formioLogin,
    authentication,
    logout,
    formRegister,
    register,
    confirmation,
    formForgotPassword,
    resetPassword,
    confirmNewToken,
    newPassword
}
