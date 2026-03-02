import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Successfully connected to MongoDB")

    }
    catch(error){
        console.log("Error connecting to MongoDB",error)
        process.exit(1); // 1 which shows failure and exit  

    }
}

export default connectDB