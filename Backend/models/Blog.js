const {Schema, model} = require("../db/connection") // import Schema & model

// Alumni Schema
const BlogSchema = new Schema({
    userId:{type: String, requried: true},
    firstName:{type: String,required: true},
    lastName:{type: String,required: true},
    title:{type: String,required: true},
    domain:{type: String},
    content:{type: String,required: true}
})

// Alumni model
const Blog = model("Blog", BlogSchema)

module.exports = Blog