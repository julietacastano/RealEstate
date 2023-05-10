import { DataTypes } from "sequelize";
import bcyrpt from 'bcrypt'
import db from "../config/db.js";

const User = db.define('users',{
    name:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    token: DataTypes.STRING,
    confirm: DataTypes.BOOLEAN
}, {
    hooks:{
        beforeCreate: async function(user){
            const salt = await bcyrpt.genSalt(10)
            user.password = await bcyrpt.hash(user.password, salt)
        }
    },
    scopes:{
        deletePassword:{
            attributes:{
                exclude:['password', 'token', 'confirm', 'createdAt', 'updatedAt']
            }
        }
    }
});

User.prototype.checkPassword = function(pass){
    return bcyrpt.compareSync(pass, this.password)
}

export default User;