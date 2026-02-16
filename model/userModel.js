import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        requireed: true
    },
    email:{
        type:String,
        requireed: true,
        unique:true
    },
    password:{
        type:String,
        requireed: true
    },
    resetOtp:{
        type:String,
        default: ''
    },
    resetOtpExpireAt:{
        type: Number,
        default: 0
    },
},{timestamps:true});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;