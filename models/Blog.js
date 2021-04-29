const mongoose = require("mongoose");

var BlogSchema=new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required : true
    },
    description:{
        type: String,
        trim: true,
        required : true
    },
    email:{
        type: String,
        trim: true,
        required : true
    },
    name:{
        type: String,
        trim: true,
        required : true
    },
    imageURL:{
        type: String,
        required : true
    },
    likes :{
        type : Number , 
    },
    created:  {type:Date,default:Date.now}
})

module.exports = mongoose.model("blogs", BlogSchema);