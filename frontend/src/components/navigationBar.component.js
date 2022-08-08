const NavigationBar = () => {
  return (
    <>
      <ul className='navigationBarList'>
        <li className="homeNavPart">
          <a href="/">Home</a>
        </li>
        <li className="dropdown">
          <a className="dropbtn">Register</a>
          <div className="dropdown-content">
            <a href="/registerCompany">Company</a>
            <a href="/registerUser">User</a>
          </div>
        </li>
        <li className="dropdown">
          <a className="dropbtn">Login</a>
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