import express from 'express';

const router = express.Router();

export function getNotes(req,res){
    res.status(200).send("you have 5 notes");
}

export function createNote(req,res){
    res.status(201).json({message:"Note created successfully"});
}

export function updateNote(req,res){
    res.status(200).json({message:"Note updated successfully"});
}

export function deleteNote(req,res){
    res.status(200).json({message:"Note deleted successfully"});
}

export default router;
