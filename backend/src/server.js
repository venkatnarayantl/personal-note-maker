//const express = require('express');
import express from 'express';
import notesRoutes from './routes/notesRoutes.js';

const app = express();

//endpoint -> url+http method 
app.use("/api/notes",notesRoutes);



app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})