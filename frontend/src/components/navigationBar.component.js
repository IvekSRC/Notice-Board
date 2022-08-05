import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <div className='navBar'>
      <div className='navBarPart'>
        <Link className='navBarItem activeHome' to="/">Home</Link>
      </div>
      <div className='navBarPart'>
        <Link className='navBarItem' to="/register">Register</Link>
      </div>
      <div className='navBarPart'>
        <Link className='navBarItem' to="/login">Login</Link>
      </div>
    </div>
  )
}

export default NavigationBar;