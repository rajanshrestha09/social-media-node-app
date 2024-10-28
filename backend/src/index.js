import dotenv from 'dotenv'
import dbConnect  from "./db/index.js";

import  {app} from './app.js'

dotenv.config({
    path: './.env'
})



const PORT_NUMBER = process.env.PORT_NUMBER
dbConnect()
    .then(()=>{
        app.listen(PORT_NUMBER, ()=>{
            console.log(`Server is running at port : `, process.env.PORT_NUMBER);        
        })
    })
    .catch(err=>{
        console.log("Connection failed at index.js:: Error ==> ", err);
    })
