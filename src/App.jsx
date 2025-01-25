import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from './components/Navbar'
import Home from './components/MainContent/Home'
import Footer from './components/Footer'
import Stocks from './components/MainContent/Stocks'
import Login from './components/MainContent/Login'
import SignUp from './components/MainContent/SignUp'



function App() {
  return (
    <>
      <Router>
        <div className="bg-gray-100 dark:bg-gray-800 flex flex-col min-h-screen">
          <Navbar />
          
          <div className="flex flex-col justify-center items-center flex-grow">
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/stocks" element={<Stocks/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<SignUp/>}/>
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </>
  )
}

export default App