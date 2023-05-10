import bcyrpt from 'bcrypt'

const users =[
    {
        name:'Julieta',
        email:'julieta@correo.com',
        confirm: 1,
        password: bcyrpt.hashSync('password', 10)
    }
]

export default users