import React, { useState } from "react";
import { fetchData } from '../services/fetch.service';
import Switch from '@mui/material/Switch';

const LoginForm = () => {
    // React States
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

    // JSX code for login form
    const renderForm = (
        <form onSubmit={handleSubmit} className="logInForm">
            <div className="logInViaDiv">
                <label className="logInViaLabel">You are</label>
                <label className="logInViaUser" id="logInViaUser">User</label>                
                <Switch color="primary" id="loginVia" className="loginViaSwitch" onChange={changeLogInVia}/>
                <label className="logInViaCompany" id="logInViaCompany">Company</label>
            </div>
            <div className="input-container">
                <label className="logInEmailAndPasswordLabel">Email: </label>
                <input type="text" name="email" required className="loginInputName"/>
                {renderErrorMessage("email")}
            </div>
            <div className="input-container">
                <label className="logInEmailAndPasswordLabel">Password: </label>
                <input type="password" name="pass" required className="loginInputPassword"/>
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
                    <div className="succesfullyLoggedIn">Successfully logged In</div>
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
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