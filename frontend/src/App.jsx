import {Route,Routes} from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import NoteDetailPage from './pages/NoteDetailPage'





function App() {  
  return (
  <div data-theme="cupcake" className="min-h-screen bg-base-100 text-base-content">
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/create" element={<CreatePage />}></Route>
      <Route path="/note/:id" element={<NoteDetailPage />}></Route>
    </Routes>
  </div>

  )
}

export default App