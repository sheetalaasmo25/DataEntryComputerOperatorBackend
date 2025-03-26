require('dotenv').config();
const mongoose = require('mongoose')

const connectDB = async ()=>{
    try{
        const mongoURL = process.env.MONGO_URL;
        if(!mongoURL){
            throw new Error("MONGO_URI is not defined in .env file");
        }
        await mongoose.connect(mongoURL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("MongoDB Connected ✅")
    }
    catch(error){
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports=connectDB;