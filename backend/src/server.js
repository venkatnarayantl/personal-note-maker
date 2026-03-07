//const express = require('express');
import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'


import notesRoutes from './routes/notesRoutes.js';
import connectDB from './config/db.js'
import ratelimiter from './middleware/ratelimit.js'


dotenv.config()

const app = express();
const port = process.env.PORT || 5001
const __dirname = path.resolve();

//middleware
if(process.env.NODE_ENV !== "production"){
    app.use(cors({
        origin: "http://localhost:5173"
    }));
}
app.use(express.json());
app.use(ratelimiter);


//basic understanding of how middleware works
// app.use((req,res,next)=>{
//     console.log(`Req method ${req.method} and url ${req.url}`)
//     next(); // used this function to pass the control to the next middleware or route handler
// })


//endpoint -> url+http method 
app.use("/api/notes",notesRoutes);

if(process.env.NODE_ENV ==="production"){
    
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("/*splat",(_,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist","index.html"))
    })
}


connectDB().then(()=>{
    app.listen(port,()=>{
    console.log('Server is running on port ',port);
})
})
