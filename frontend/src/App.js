import "./index.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from "./pages/register.page";
import Login from "./pages/login.page";
import Home from "./pages/home.page";

function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
    </Router>
  );
}

export default App;