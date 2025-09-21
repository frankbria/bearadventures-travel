import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import './styles/App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Additional routes will be added during content integration */}
      </Routes>
    </div>
  )
}

export default App