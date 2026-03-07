import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI'
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import api from '../libs/axios';
import NotesNotFound from '../components/NotesNotFound';



function HomePage({ user, onLogout }) {
  const [isRateLimited, setIsRateLimited] = React.useState(false);
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(()=>{
    const fetchNotes = async() =>{
      try{
        const res = await api.get("/notes")
        setNotes(res.data)
        setIsRateLimited(false)

      }
      catch(error){
        console.error("Error fetching notes");
        console.log(error);
        if(error.response?.status === 429){
          setIsRateLimited(true);
        }
        else{
          toast.error("Failed to fetch notes");
        }
        
      }
      finally{
          setLoading(false);
        }
    }
    fetchNotes();
  },[])

  return (
    <div className='min-h-screen'>
      <Navbar onLogout={onLogout} user={user} />
      {isRateLimited && <RateLimitedUI/>}

      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && <div className='text-center text-primary py-6'>Loading...</div>}
        {notes.length ===0 && !isRateLimited && <NotesNotFound/>}

        {notes.length > 0 && !isRateLimited && (
          <div className='grid grid-cols-1 md: grid-cols-2 lg:grid-cols-3 gap-10'>
            {notes.map((note)=>(
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage