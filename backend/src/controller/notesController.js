import express from 'express';
import Note from '../models/Note.js'

const router = express.Router();

export async function getNotes(req,res){
    try{
        const notes = await Note.find().sort({createdAt:-1}); //sort the newest first
        res.status(200).json(notes)
    }
    catch(error){
        console.log("Error in getNotes:", error);
        res.status(501).json({message:"Internal server error"})
    }
}

export async function getNoteById(req,res){
    try{
        const note = await Note.findById(req.params.id);
        if(!note) return res.status(404).json({message:"Note not found"});

        return res.status(200).json(note);

    }
    catch(error){
        console.log("Error in getNoteById:", error);
        res.status(501).json({message:"Internal server error"})
    }
}

export async function createNote(req,res){
    try{
        const {title,content} = req.body;
        const newnote = await Note.create({title,content});
        const saveNote = await newnote.save();
        console.log("Note created successfully");
        res.status(201).json(saveNote);
    }
    catch(error){
        console.log("Error in createNote:", error);
        res.status(501).json({message:"Internal server error"})
    }
}

export async function updateNote(req,res){
    try{
        const {title,content} = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {title,content},
            {new : true}
        );
        if (!updatedNote) return res.status(404).json({"message" : "Note not found"});

        return res.status(200).json(updatedNote);
        

    }
    catch(error){
        console.log("Error in updateNote:", error);
        res.status(501).json({message:"Internal server error"})
    }
}


export async function deleteNote(req,res){
    try{
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if(!deletedNote) return res.status(404).json({message:"Note not found"});

        return res.status(200).json({message:"Note deleted successfully"});

    }
    catch(error){
        console.log("Error in deleteNote:", error);
        res.status(501).json({message:"Internal server error"})
    }
}

export default router;
