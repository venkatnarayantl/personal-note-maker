//const express = require('express');
import express from 'express';
import notesRoutes from './routes/notesRoutes.js';
import connectDB from './config/db.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
connectDB()
const port = process.env.PORT || 5001



//endpoint -> url+http method 
app.use("/api/notes",notesRoutes);



app.listen(port,()=>{
    console.log('Server is running on port ',port);
})