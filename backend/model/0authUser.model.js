import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ 
    userName:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    OauthId:{
        type:String,
        unique:true
    },
    fullName:{
        type:String,
        unique:false
    },
    email:{
        type:String,
        required:true,
        // unique:String
    },
    password:{
        type:String,
        default:null
    }
},{timestamps:true})

export const User = mongoose.model('User',userSchema)

