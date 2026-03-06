import { ArrowLeftIcon } from "lucide-react"  
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import api from '../libs/axios'

const CreatePage = () =>{
  const [title,setTitle] = React.useState("")
  const [content,setContent] = React.useState("")
  const [loading,setLoading] = React.useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!title.trim() || !content.trim()){
      toast.error("Please fill all fields")
      return;
    }
    setLoading(true)
    try{
      await api.post("/notes",{
        title,
        content
      
      })
      toast.success("Note created successfully")
      navigate("/")
    }
    catch(error){
      console.log("Error creating a note : ",error)
      if(error.response.status === 429){
        toast.error("Too many requests. Please try again later.",{duration : 4000, icon: "⚠️"})
      }
      else{
        toast.error("Failed to create a note")
      }
    }
    finally{
      setLoading(false)
    }

  }

  return(
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6 bg-blue-500/60 hover:bg-blue-500/30 rounded-full">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          <div className="card bg-base-100 shadow-xl bg-blue-800/30">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4 px-4 py-2 bg-blue-500/20 font-bold">Create New Note</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text text-base font-medium text-white ml-2 mb-2">TITLE</span>
                  </label>
                <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered w-full border-white border-2 rounded-full px-4 py-2 bg-blue-500/20 mb-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                
              </div>
              <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text text-base font-medium text-white ml-2 mb-3">CONTENT</span>
                  </label>
                <textarea
                    placeholder="Write your notes..... "
                    className="input input-bordered w-full border-white border-2 rounded-30 px-4 py-2 bg-blue-500/20 h-32 placeholder:text-white-500 mb-5"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                
              </div>

              <div className="card-actions justify-end">
                  <button type="submit" className="btn btn-primary rounded-full px-6 py-2 text-md bg-blue-800 hover:bg-blue-700 text-white" disabled={loading}>
                    {loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              

            </form>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage