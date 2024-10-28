import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


 const dbConnect = async () =>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    //    console.log(connectionInstance);       
       console.log(`DBConnection :: Connection successful ==>${connectionInstance.connection.host}`);
       
    } catch (error) {
        console.log("DBConnection :: Error ==> ", error);
        process.exit(1)
        
    }
}

export default dbConnect