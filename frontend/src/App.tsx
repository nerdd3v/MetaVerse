import './App.css'
import Background from './self-comp/Background'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<Background/>}/>
      </Routes>
    </Router>
  )
}

export default App
