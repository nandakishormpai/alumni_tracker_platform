const {Schema, model} = require("../db/connection") // import Schema & model
var extend = require('mongoose-schema-extend');
const UserSchema = require('../models/User');
// console.log(User)

var start = new Date();
var ymax = start.getFullYear();

// Alumni Schema
const AlumniSchema = new Schema({
    higherStudies:[{
        degree:{type:String},
        university:{type:String},
        yearGraduation:{type:Number, min: 1943, max: ymax},
        subject:{type:String}
    }],
    workExperience:[{from:{type:Number, min: 1943, max: ymax},
                    to:{type:Number, min: 1943, max: ymax},
                    company:{type:String},
                    role:{type:String},
                    Contribution:{type:String}}],
    publications:[{domain:{type:String},title:{type:String},link:{type:String},description:{type:String}}]})


// Alumni model
// const Alumni = model("Alumni", AlumniSchema)
const User = model("User", UserSchema)
const Alumni = User.discriminator("Alumni", AlumniSchema)

module.exports = Alumni








// AlumniSchema.add(UserSchema).add({
//     higherStudies:[{
//         degree:{type:String},
//         university:{type:String},
//         yearGraduation:{type:Number, min: 1943, max: ymax},
//         subject:{type:String}
//     }],
//     workExperience:[{from:{type:Number, min: 1943, max: ymax},
//                     to:{type:Number, min: 1943, max: ymax},
//                     company:{type:String},
//                     role:{type:String},
//                     Contribution:{type:String}}],
//     publications:[{domain:{type:String},title:{type:String},link:{type:String},description:{type:String}}]
        
//     // userId:{type: String, unique: true, requried: true},
//     // username: {type: String, unique: true, required: true},
//     // email:{type: String, unique: true, required: true},
//     // password: {type: String, unique: true, required: true},
//     // name:{type: String,required: true},
//     // areasOfInterest:[String],
//     // address:{type: String},
//     // zip:{type:Number},
//     // linkedin:{type:String},
//     // github:{type:String},
//     // otherLinks:{type:String}
// })