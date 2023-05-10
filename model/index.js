import Category from "./Category.js";
import Message from "./Message.js";
import Price from "./Price.js";
import Property from "./Property.js"
import User from "./User.js"

Property.belongsTo(Price);
Property.belongsTo(Category);
Property.belongsTo(User);
Property.hasMany(Message)

Message.belongsTo(Property)
Message.belongsTo(User)

export{
    Category,
    Price,
    Property,
    User,
    Message
}