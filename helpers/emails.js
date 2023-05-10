import nodemailer from 'nodemailer'

const registerEmail = async (data)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {name, email, token} = data

    //Send mail
    await transport.sendMail({
        from: 'RealEstate.com',
        to: email,
        subject: 'Activate your account in RealEstate',
        text: 'Email confirmation for RealEstate',
        html:`
            <p>Hey ${name}, you're almost ready to start enjoying RealEstate</p>
            <p>Simply click the following link:  <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmation/${token}"> verify email adress </a></p>

            <p> If you received this email by mistake, just ignore it</p>            
            `

    })

}

const forgotPasswordEmail = async (data)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {name, email, token} = data

    //Send mail
    await transport.sendMail({
        from: 'RealEstate.com',
        to: email,
        subject: 'Reset your password in RealEstate',
        text: 'Reset your password in RealEstate',
        html:`
            <p>Hey ${name}, a request has been received to change your password</p>
            <p>Simply click the following link:<a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgot-password/${token}"> Reset password </a></p>

            <p> If you didn't make this requested, just ignore it</p>            
            `

    })

}

export {
    registerEmail,
    forgotPasswordEmail
}