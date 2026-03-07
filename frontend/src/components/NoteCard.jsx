import React from 'react'
import { Link } from "react-router";
import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import { formatDate } from '../libs/utils';
import api from '../libs/axios';
import { toast } from 'react-hot-toast';

const NoteCard = ({note, setNotes}) =>{

    const handleDelete = async (e,id)=>{
      e.preventDefault();
      if(!window.confirm("Are you sure you want to delete this note?")){
        return;
      }
      try{
        await api.delete(`/notes/${id}`)
        setNotes((prev)=> prev.filter(note => note._id !==id))
        toast.success("Note deleted successfully");
      }
      catch(error){
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note");
      }
    }

    return <Link to={`/notes/${note._id}`} className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-t-4 border-solid border-blue-300">
         <div className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-sm text-base-content/60">
            Created: {formatDate(new Date(note.createdAt))}
          </span>
          {note.updatedAt !== note.createdAt && (
            <span className="text-sm text-base-content/60">
              Edited: {formatDate(new Date(note.updatedAt))}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-2">
          <PenSquareIcon className="size-4" />
          <button
            className="btn btn-ghost btn-xs text-error" onClick={(e)=> handleDelete(e, note._id)}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </Link>
}

export default NoteCard