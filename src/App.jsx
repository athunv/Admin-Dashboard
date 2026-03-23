import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import AdminDashboard from './components/AdminDashboard'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AdminDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App