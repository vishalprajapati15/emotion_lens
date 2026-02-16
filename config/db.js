import mongoose from "mongoose";

const connectDB= async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/emotion_lense`)
        .then(()=>{
            console.log("Database Connected Succesfully!!");
        });
    } catch (error) {
        console.log("Database Connetction error: ", error);
    }
}
export default connectDB;