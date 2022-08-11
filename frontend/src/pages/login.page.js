import LoginForm from "../components/loginForm.component";
import NavigationBar from "../components/navigationBar.component";

const Login = () => {
  return (
    <>
      <div className="loginImage">
        <NavigationBar/>
        <LoginForm/>
      </div>
    </>
  )
}

export default Login;