import { AiFillHome } from 'react-icons/ai';
import { BiLogIn, BiLogInCircle, BiLogOutCircle, BiRegistered } from 'react-icons/bi';
import { isLogged, logOut } from '../services/auth.services';

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
        {
          isLogged() == true ? 
          <li className="dropdown">
            <a href="/" onClick={logOut}>
              Logout
              <BiLogOutCircle className='navBarIcon'/>
            </a>
          </li>
          :
          <>
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
              <a href="/login">
                Login
                <BiLogIn className='navBarIcon'/>
              </a>
            </li>
          </>
        }
      </ul>
    </>
  )
}

export default NavigationBar;