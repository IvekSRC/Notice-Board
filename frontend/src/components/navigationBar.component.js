import { AiFillHome } from 'react-icons/ai';
import { BiLogInCircle, BiRegistered } from 'react-icons/bi'

const NavigationBar = () => {
  return (
    <>
      <ul className='navigationBarList'>
        <li className="homeNavPart">
          <a href="/">
            Home
            <AiFillHome className='navBarIcon'/>
          </a>
        </li>
        <li className="dropdown registerDropDown">
          <a className="dropbtn">
            Register
            <BiRegistered className='navBarIcon'/>
          </a>
          <div className="dropdown-content">
            <a href="/registerCompany">Company</a>
            <a href="/registerUser">User</a>
          </div>
        </li>
        <li className="dropdown">
          <a className="dropbtn">
            Login
            <BiLogInCircle className='navBarIcon'/>
          </a>
          <div className="dropdown-content">
            <a href="/loginCompany">Company</a>
            <a href="/loginUser">User</a>
          </div>
        </li>
      </ul>
    </>
  )
}

export default NavigationBar;