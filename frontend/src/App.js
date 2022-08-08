import "./index.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import RegisterCompany from "./pages/registerCompany.page";
import LoginCompany from "./pages/loginCompany.page";
import Home from "./pages/home.page";
import RegisterUser from "./pages/registerUser.page";
import LoginUser from "./pages/loginUser.page";

function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/registerCompany' element={<RegisterCompany/>} />
          <Route path='/registerUser' element={<RegisterUser/>} />
          <Route path='/loginCompany' element={<LoginCompany/>} />
          <Route path='/loginUser' element={<LoginUser/>} />
        </Routes>
    </Router>
  );
}

export default App;