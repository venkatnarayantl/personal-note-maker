import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI'
import axios from 'axios';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';


function HomePage() {
  const [isRateLimited, setIsRateLimited] = React.useState(false);
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(()=>{
    const fetchNotes = async() =>{
      try{
        const res = await axios.get("http://localhost:5001/api/notes")
        console.log(res.data);
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
      <Navbar />
      {isRateLimited && <RateLimitedUI/>}

      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && <div className='text-center text-primary py-6'>Loading...</div>}

        {notes.length > 0 && !isRateLimited && (
          <div className='grid grid-cols-1 md: grid-cols-2 lg:grid-cols-3 gap-10'>
            {notes.map((note)=>(
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage