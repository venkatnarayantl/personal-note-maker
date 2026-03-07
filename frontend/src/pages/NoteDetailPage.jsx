import { useEffect } from 'react'
import { useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import api from '../libs/axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom';
import { LoaderIcon, Trash2Icon, ArrowLeftIcon} from 'lucide-react';


const NoteDetailPage = () => {
  const [note,setNote] = useState(null)
  const [loading, setloading] = useState(true)
  const [saving, setSaving] = useState(false)

  const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    const fetchNote = async () =>{
      try{
        const res = await api.get(`/notes/${id}`)
        setNote(res.data)

      }
      catch(error){
        console.error("Error fetching note:", error);
        toast.error("Failed to load note");

      }
      finally{
        setloading(false)
      }
    }
    fetchNote()
  }, [id]);
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };


   const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };


  if(loading) {
    return (
      <div className='min-h-screen bg-base-200 flex items-center justify-center'>
        <LoaderIcon className='animate-spin size-10'/>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost bg-primary text-primary-content hover:bg-blue-800 rounded-full">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button onClick={handleDelete} className="btn btn-outline border-2 border-error text-red-500 hover:bg-red-600 hover:text-white px-6 rounded-full">
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          <div className="card bg-base-100 shadow-xl bg-blue-800/30">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-base font-medium text-white ml-2 mb-2">TITLE</span>
                </label>
                <input type="text" placeholder="Note Title" className="input input-bordered w-full border-white border-2 rounded-full px-4 py-2 bg-blue-500/20 mb-3" value={note.title}  onChange={(e) => setNote({ ...note, title: e.target.value})}/>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-base font-medium text-white ml-2 mb-3">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="input input-bordered w-full border-white border-2 rounded-30 px-4 py-2 bg-blue-500/20 h-32 placeholder:text-white-500 mb-5"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-primary rounded-full px-6 py-2 text-md bg-primary hover:bg-blue-700 text-white" disabled={saving} onClick={handleSave}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default NoteDetailPage
