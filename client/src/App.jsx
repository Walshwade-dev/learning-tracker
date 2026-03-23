import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Today from './pages/Today'
import Progress from './pages/Progress'
import Roadmap from './pages/Roadmap'

function App() {
  return (
    <BrowserRouter>
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <main className='max-w-3xl md:max-w-6xl lg:max-w-[70%] mx-auto mt-6 px-4' >
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
  
}

export default App
