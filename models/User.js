const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
    },
    email:{
        type : String , 
        trim : true,
    },
});

module.exports = mongoose.model("users", UserSchema);