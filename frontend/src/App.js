import "./index.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import RegisterCompany from "./pages/registerCompany.page";
import Login from "./pages/login.page";
import Home from "./pages/home.page";
import RegisterUser from "./pages/registerUser.page";
import ProfileUser from "./pages/profileUser.page";
import ProfileCompany from "./pages/profileCompany.page";

function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/registerCompany' element={<RegisterCompany/>}/>
          <Route path='/registerUser' element={<RegisterUser/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/profileUser' element={<ProfileUser/>}/>
          <Route path='/profileCompany' element={<ProfileCompany/>}/>
        </Routes>
    </Router>
  );
}

export default App;