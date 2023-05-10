import Express from "express";
import { formioLogin, authentication, logout, formRegister, register, confirmation, formForgotPassword, resetPassword, confirmNewToken, newPassword } from "../controllers/userController.js";

const userRouter = Express.Router()

userRouter.get('/login',formioLogin)
userRouter.post('/login',authentication)

userRouter.post('/logout',logout)

userRouter.get('/register', formRegister)
userRouter.post('/register', register)

userRouter.get('/confirmation/:token', confirmation)

userRouter.get('/forgot-password', formForgotPassword)
userRouter.post('/forgot-password', resetPassword)

userRouter.get('/forgot-password/:token', confirmNewToken)
userRouter.post('/forgot-password/:token', newPassword)

export default userRouter