import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Property = db.define('properties',{
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey:true,
    },
    title:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull:false
    },
    rooms:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    parking:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    bath:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    address:{
        type:DataTypes.STRING(60),
        allowNull:false
    },
    lat:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lng:{
        type:DataTypes.STRING,
        allowNull:false
    },
    img:{
        type:DataTypes.STRING,
        allowNull:false
    },
    posted:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: false
    },
})

export default Property