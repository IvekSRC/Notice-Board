import React, { useState } from "react";
import { fetchData } from '../services/fetch.service';
import Switch from '@mui/material/Switch';
import { BiShow } from "react-icons/bi";
import { BsPersonCheckFill } from 'react-icons/bs';

const LoginForm = () => {
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (event) => {
        // Prevent page reload
        event.preventDefault();

        var { email, pass } = document.forms[0];
        const loginVia = document.getElementById('loginVia').checked;

        const credentials = {
            email: email.value,
            password: pass.value
        }

        var response = undefined;
        if(loginVia) {
            response = await (await fetchData('companys/login', 'POST', credentials)).json();
        } 
        else {
            response = await (await fetchData('users/login', 'POST', credentials)).json();
        }

        if(response.token != null) {
            localStorage.setItem('token', response.token);
            if(loginVia) {
                localStorage.setItem('loggedEntity', 'company');
                localStorage.setItem('companyId', response.company._id);
            } else {
                localStorage.setItem('loggedEntity', 'user');
                localStorage.setItem('userId', response.user._id);
            }
            setIsSubmitted(true);
        } else {
            if(response[0] == 'P') {
                setErrorMessages({ name: "pass", message: response });
            }
            else {
                setErrorMessages({ name: "email", message: response });
            }
        }
    };

    const redirectToHomePage = () => {
        setTimeout(() => {
            window.location.replace('/');
        }, 2000)
    }

    const changeLogInVia = () => {
        const switchButton = document.getElementById('loginVia');
        if(switchButton.checked) {
            document.getElementById('logInViaCompany').style.color = 'blue';
            document.getElementById('logInViaUser').style.color = 'black';
        } else {
            document.getElementById('logInViaUser').style.color = 'white';
            document.getElementById('logInViaCompany').style.color = 'black';
        }
    }

    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
        <div className="loginError">{errorMessages.message}</div>
        );

    const showPassword = () => {
        var typePass = document.getElementById('loginUserPassword');
        
        if(typePass.type === 'text') {
            typePass.type = 'password'
        } else {
            typePass.type = 'text';
        }
    }

    // JSX code for login form
    const renderForm = (
        <form onSubmit={handleSubmit} className="logInForm">
            <div className="logInViaDiv">
                <div className="logInViaLabel">You are</div>
                <div className="logInViaUser" id="logInViaUser">User</div>                
                <Switch color="primary" id="loginVia" className="loginViaSwitch" onChange={changeLogInVia}/>
                <div className="logInViaCompany" id="logInViaCompany">Company</div>
            </div>
            <div className="input-container">
                <label className="logInEmailAndPasswordLabel">Email: </label>
                <input type="text" name="email" required className="loginInputName"/>
                {renderErrorMessage("email")}
            </div>
            <div className="input-container">
                <label className="logInEmailAndPasswordLabel">Password: </label>
                <div className="showLogInPassword">
                    <input type="password" name="pass" required className="loginInputPassword" id='loginUserPassword'/>
                    <div id='passVisible' className="logInPass" onClick={showPassword}><BiShow size={25}></BiShow></div>
                </div>
                {renderErrorMessage("pass")}
            </div>
            <div className="button-container">
                <input type="submit" className="loginSubmitButton"/>
            </div>
        </form>
    );

    return (
    <div className="app">
        <div className="login-form">
            <div className="loginTitle">
                Sign In
            </div>
            {
                isSubmitted ? 
                <div>
                    <div className="succesfullyLoggedIn">
                        <div className="logInSuccessfullyTitle">Successfully logged In</div>
                        <BsPersonCheckFill size={30} className='logInSuccessfullyIcon'/>
                    </div>
                    <div className="logInLoading">
                        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                    </div>
                    <div>
                        {
                            redirectToHomePage()
                        }
                    </div>
                </div> 
                : 
                renderForm
            }
        </div>
    </div>
    );
}

export default LoginForm;