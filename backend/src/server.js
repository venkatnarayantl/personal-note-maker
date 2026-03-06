//const express = require('express');
import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'


import notesRoutes from './routes/notesRoutes.js';
import connectDB from './config/db.js'
import ratelimiter from './middleware/ratelimit.js'


dotenv.config()

const app = express();

const port = process.env.PORT || 5001

//middleware
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());
app.use(ratelimiter);


//basic understanding of how middleware works
// app.use((req,res,next)=>{
//     console.log(`Req method ${req.method} and url ${req.url}`)
//     next(); // used this function to pass the control to the next middleware or route handler
// })


//endpoint -> url+http method 
app.use("/api/notes",notesRoutes);


connectDB().then(()=>{
    app.listen(port,()=>{
    console.log('Server is running on port ',port);
})
})
