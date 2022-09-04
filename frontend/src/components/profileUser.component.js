import { CgProfile } from 'react-icons/cg';
import { useEffect, useState } from 'react';
import { validateRequiredField } from '../validators/requiredField.validator';
import { fetchData } from '../services/fetch.service';
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BiShow } from 'react-icons/bi';
import Checkbox from '@mui/material/Checkbox';

const UserProfile = (user) => {
    const [activeStep, setActiveStep] = useState(0);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const steps = ['Step 1', 'Step 2', 'Step 3'];

    const [firstName, setFirstName] = useState(user.user.firstName);
    const [lastName, setLastName] = useState(user.user.lastName);
    const [nickName, setNickName] = useState(user.user.nickName);
    const [gender, setGender] = useState(user.user.gender);
    const [country, setCountry] = useState(user.user.country);

    useEffect(() => { }, []);

    const isStepOptional = (step) => {
        return step === 1;
    };
    
    const handleNext = async () => {
        if(activeStep == 0 && isValidChanges() == false) {
            return;
        }

        if(activeStep == 1 && await isValidPassword() == false) {
            return;
        }

        if(activeStep == 2) {
            const isChecked = isConfirmedUpdate();
            if(!isChecked) {
                return;
            } else {
                await editUserInformation();
            }
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    
    const handleRefresh = () => {
        window.location.replace('/profileUser');
    };

    const isValidChanges = () => {
        const firstName = document.getElementById('editFirstName');
        const firstNameErrorField = document.getElementById('editFirstNameErrorMessage');
        const lastName = document.getElementById('editLastName');
        const lastNameErrorField = document.getElementById('editLastNameErrorMessage');
        const nickName = document.getElementById('editNickName');
        const nickNameErrorField = document.getElementById('editNickNameErrorMessage');

        var isValid = true;
        if(validateRequiredField(firstName, 2, firstNameErrorField) == false) {
          isValid = false;
        }
        if(validateRequiredField(lastName, 2, lastNameErrorField) == false) {
            isValid = false;
        }
        if(validateRequiredField(nickName, 3, nickNameErrorField) == false) {
            isValid = false;
        }

        if(isValid == true) {
            setFirstName(firstName.value);
            setLastName(lastName.value);
            setNickName(nickName.value);

            var gender = undefined;
            if(document.getElementById('genderMale').checked) {
                gender = document.getElementById('genderMale').value;
            } else if (document.getElementById('genderFemale').checked) {
                gender = document.getElementById('genderFemale').value;
            }
            setGender(gender);

            var country = document.getElementById('editCountry').value;
            if(country == 'Select country') {
                country = undefined;
            }
            setCountry(country);
        }

        return isValid;
    }

    const isValidPassword = async () => {
        const password = document.getElementById('password');
        const passwordErrorField = document.getElementById('passwordErrorMessage');
        
        if(password.value.length == 0) {
            password.style.border = '2px solid red';
            passwordErrorField.innerHTML = "Password can not be empty string";
            passwordErrorField.style.color = 'red';

            return false;
        }

        const token = localStorage.getItem('token');
        const response = await (await fetchData(`users/confirmPassword/${password.value}`, 'GET', undefined, token)).json();
        
        if(!response.isValid) {
            password.style.border = '2px solid red';
            passwordErrorField.innerHTML = response.message;
            passwordErrorField.style.color = 'red';

            return false;
        } else {
            password.style.border = '1px solid black';
            passwordErrorField.innerHTML = '';

            return true;
        }
    }

    const isConfirmedUpdate = () => {
        const isChecked = document.getElementById('confirmUpdateBtn').checked;
        const errorMessage = document.getElementById('confirmUpdateErrorMessage');

        if(!isChecked) {
            errorMessage.innerHTML = 'You need to confirm your update';
            errorMessage.style.color = 'red';

            return false;
        } else {
            errorMessage.innerHTML = '';

            return true;
        }
    }

    const editUserInformation = async () => {
        const updatedUser = {
            firstName: firstName,
            lastName: lastName,
            nickName: nickName,
            gender: gender,
            country: country
        }
        
        const token = localStorage.getItem('token');
        await fetchData('users', 'PATCH', updatedUser, token);
    }

    const showPassword = () => {
        var typePass = document.getElementById('password');
        
        if(typePass.type === 'text') {
          typePass.type = 'password'
        } else {
          typePass.type = 'text';
        }
    }

    const renderConfirmPassword = () => {
        return (
            <div className="editUserPart">
                <label className="confirmPasswordUserPageLabel"> 
                    Password
                </label>
                <div className="new iconBox">
                    <i className="fa fa-user" aria-hidden="true"></i>
                </div>
                <div className='confirmPasswordUserPage'>
                    <input type="password" className='inputEditFieldUser' name="password" placeholder="Password" required id='password' minLength={7}/>
                    <div id='passVisible' className='confirmPasswordUserPageVisibleBtn' onClick={showPassword}><BiShow size={25}></BiShow></div>
                </div>
                <span id='passwordErrorMessage' className='errorMessage'></span>
                <div className="clr"></div>
            </div>
        )
    }

    const changeFirstName = (event) => {
        setFirstName(event.target.value);
        user.user.firstName = event.target.value;
    }

    const changeLastName = (event) => {
        setLastName(event.target.value);
        user.user.lastName = event.target.value;
    }

    const changeNickName = (event) => {
        setNickName(event.target.value);
        user.user.nickName = event.target.value;
    }

    const changeGender = (event) => {
        setGender(event.target.value);
        user.user.gender = event.target.value;
    }

    const changeCountry = (event) => {
        setCountry(event.target.value);
        user.user.country = event.target.value;
    }

    const renderEditUserInformation = () => {
        return (
            <div className="editUserInformation">
                
                <div className="editUserPart">
                    <label className="fl"> 
                        First Name: 
                    </label>
                    <div className="new iconBox">
                        <i className="fa fa-user" aria-hidden="true"></i>
                    </div>
                    <div className="fr">
                        <input type="text" name="firstName" className='inputEditFieldUser' placeholder="First Name" value={user.user.firstName || ''} onChange={changeFirstName} id='editFirstName' minLength={2}/>
                    </div> 
                    <span id='editFirstNameErrorMessage' className='errorMessage'></span>
                    <div className="clr"></div>
                </div>

                <div className="editUserPart">
                    <label className="fl"> 
                        Last Name: 
                    </label>
                    <div className="new iconBox">
                        <i className="fa fa-user" aria-hidden="true"></i>
                    </div>
                    <div className="fr">
                        <input type="text" name="lastName" className='inputEditFieldUser' placeholder="Last Name" value={user.user.lastName || ''} onChange={changeLastName} id='editLastName' minLength={2}/>
                    </div> 
                    <span id='editLastNameErrorMessage' className='errorMessage'></span>
                    <div className="clr"></div>
                </div>

                <div className="editUserPart">
                    <label className="fl"> 
                        Nick Name: 
                    </label>
                    <div className="new iconBox">
                        <i className="fa fa-user" aria-hidden="true"></i>
                    </div>
                    <div className="fr">
                        <input type="text" name="nickName" className='inputEditFieldUser' placeholder="Nick Name" value={user.user.nickName || ''} onChange={changeNickName} id='editNickName' minLength={3}/>
                    </div> 
                    <span id='editNickNameErrorMessage' className='errorMessage'></span>
                    <div className="clr"></div>
                </div>

                <div className="editUserPart editUserGender">
                    <input type="radio" name="Gender" value="Male" id='genderMale' 
                        checked={user.user.gender == 'Male' ? 'checked' : ''}
                        onChange={changeGender}
                    />
                    <label htmlFor="genderMale">Male</label>
                    <input type="radio" name="Gender" value="Female" id='genderFemale'
                        checked={user.user.gender == 'Female' ? 'checked' : ''}
                        onChange={changeGender}
                    />
                    <label htmlFor="genderFemale">Female</label>
                </div>

                <div className="input_field select_option">
                  <select id="editCountry" name="country" value={user.user.country} onChange={changeCountry}>
                    <option>Select country</option>
                    <option>Afghanistan</option>
                    <option>Aland Islands</option>
                    <option>Albania</option>
                    <option>Algeria</option>
                    <option>American Samoa</option>
                    <option>Andorra</option>
                    <option>Angola</option>
                    <option>Anguilla</option>
                    <option>Antarctica</option>
                    <option>Antigua and Barbuda</option>
                    <option>Argentina</option>
                    <option>Armenia</option>
                    <option>Aruba</option>
                    <option>Australia</option>
                    <option>Austria</option>
                    <option>Azerbaijan</option>
                    <option>Bahamas</option>
                    <option>Bahrain</option>
                    <option>Bangladesh</option>
                    <option>Barbados</option>
                    <option>Belarus</option>
                    <option>Belgium</option>
                    <option>Belize</option>
                    <option>Benin</option>
                    <option>Bermuda</option>
                    <option>Bhutan</option>
                    <option>Bolivia</option>
                    <option>Bonaire, Sint Eustatius and Saba</option>
                    <option>Bosnia and Herzegovina</option>
                    <option>Botswana</option>
                    <option>Bouvet Island</option>
                    <option>Brazil</option>
                    <option>British Indian Ocean Territory</option>
                    <option>Brunei Darussalam</option>
                    <option>Bulgaria</option>
                    <option>Burkina Faso</option>
                    <option>Burundi</option>
                    <option>Cambodia</option>
                    <option>Cameroon</option>
                    <option>Canada</option>
                    <option>Cape Verde</option>
                    <option>Cayman Islands</option>
                    <option>Central African Republic</option>
                    <option>Chad</option>
                    <option>Chile</option>
                    <option>China</option>
                    <option>Christmas Island</option>
                    <option>Cocos (Keeling) Islands</option>
                    <option>Colombia</option>
                    <option>Comoros</option>
                    <option>Congo</option>
                    <option>Congo, Democratic Republic of the Congo</option>
                    <option>Cook Islands</option>
                    <option>Costa Rica</option>
                    <option>Cote D'Ivoire</option>
                    <option>Croatia</option>
                    <option>Cuba</option>
                    <option>Curacao</option>
                    <option>Cyprus</option>
                    <option>Czech Republic</option>
                    <option>Denmark</option>
                    <option>Djibouti</option>
                    <option>Dominica</option>
                    <option>Dominican Republic</option>
                    <option>Ecuador</option>
                    <option>Egypt</option>
                    <option>El Salvador</option>
                    <option>Equatorial Guinea</option>
                    <option>Eritrea</option>
                    <option>Estonia</option>
                    <option>Ethiopia</option>
                    <option>Falkland Islands (Malvinas)</option>
                    <option>Faroe Islands</option>
                    <option>Fiji</option>
                    <option>Finland</option>
                    <option>France</option>
                    <option>French Guiana</option>
                    <option>French Polynesia</option>
                    <option>French Southern Territories</option>
                    <option>Gabon</option>
                    <option>Gambia</option>
                    <option>Georgia</option>
                    <option>Germany</option>
                    <option>Ghana</option>
                    <option>Gibraltar</option>
                    <option>Greece</option>
                    <option>Greenland</option>
                    <option>Grenada</option>
                    <option>Guadeloupe</option>
                    <option>Guam</option>
                    <option>Guatemala</option>
                    <option>Guernsey</option>
                    <option>Guinea</option>
                    <option>Guinea-Bissau</option>
                    <option>Guyana</option>
                    <option>Haiti</option>
                    <option>Heard Island and Mcdonald Islands</option>
                    <option>Holy See (Vatican City State)</option>
                    <option>Honduras</option>
                    <option>Hong Kong</option>
                    <option>Hungary</option>
                    <option>Iceland</option>
                    <option>India</option>
                    <option>Indonesia</option>
                    <option>Iran, Islamic Republic of</option>
                    <option>Iraq</option>
                    <option>Ireland</option>
                    <option>Isle of Man</option>
                    <option>Israel</option>
                    <option>Italy</option>
                    <option>Jamaica</option>
                    <option>Japan</option>
                    <option>Jersey</option>
                    <option>Jordan</option>
                    <option>Kazakhstan</option>
                    <option>Kenya</option>
                    <option>Kiribati</option>
                    <option>Korea, Democratic People's Republic of</option>
                    <option>Korea, Republic of</option>
                    <option>Kosovo</option>
                    <option>Kuwait</option>
                    <option>Kyrgyzstan</option>
                    <option>Lao People's Democratic Republic</option>
                    <option>Latvia</option>
                    <option>Lebanon</option>
                    <option>Lesotho</option>
                    <option>Liberia</option>
                    <option>Libyan Arab Jamahiriya</option>
                    <option>Liechtenstein</option>
                    <option>Lithuania</option>
                    <option>Luxembourg</option>
                    <option>Macao</option>
                    <option>Macedonia, the Former Yugoslav Republic of</option>
                    <option>Madagascar</option>
                    <option>Malawi</option>
                    <option>Malaysia</option>
                    <option>Maldives</option>
                    <option>Mali</option>
                    <option>Malta</option>
                    <option>Marshall Islands</option>
                    <option>Martinique</option>
                    <option>Mauritania</option>
                    <option>Mauritius</option>
                    <option>Mayotte</option>
                    <option>Mexico</option>
                    <option>Micronesia, Federated States of</option>
                    <option>Moldova, Republic of</option>
                    <option>Monaco</option>
                    <option>Mongolia</option>
                    <option>Montenegro</option>
                    <option>Montserrat</option>
                    <option>Morocco</option>
                    <option>Mozambique</option>
                    <option>Myanmar</option>
                    <option>Namibia</option>
                    <option>Nauru</option>
                    <option>Nepal</option>
                    <option>Netherlands</option>
                    <option>Netherlands Antilles</option>
                    <option>New Caledonia</option>
                    <option>New Zealand</option>
                    <option>Nicaragua</option>
                    <option>Niger</option>
                    <option>Nigeria</option>
                    <option>Niue</option>
                    <option>Norfolk Island</option>
                    <option>Northern Mariana Islands</option>
                    <option>Norway</option>
                    <option>Oman</option>
                    <option>Pakistan</option>
                    <option>Palau</option>
                    <option>Palestinian Territory, Occupied</option>
                    <option>Panama</option>
                    <option>Papua New Guinea</option>
                    <option>Paraguay</option>
                    <option>Peru</option>
                    <option>Philippines</option>
                    <option>Pitcairn</option>
                    <option>Poland</option>
                    <option>Portugal</option>
                    <option>Puerto Rico</option>
                    <option>Qatar</option>
                    <option>Reunion</option>
                    <option>Romania</option>
                    <option>Russian Federation</option>
                    <option>Rwanda</option>
                    <option>Saint Barthelemy</option>
                    <option>Saint Helena</option>
                    <option>Saint Kitts and Nevis</option>
                    <option>Saint Lucia</option>
                    <option>Saint Martin</option>
                    <option>Saint Pierre and Miquelon</option>
                    <option>Saint Vincent and the Grenadines</option>
                    <option>Samoa</option>
                    <option>San Marino</option>
                    <option>Sao Tome and Principe</option>
                    <option>Saudi Arabia</option>
                    <option>Senegal</option>
                    <option>Serbia</option>
                    <option>Seychelles</option>
                    <option>Sierra Leone</option>
                    <option>Singapore</option>
                    <option>Sint Maarten</option>
                    <option>Slovakia</option>
                    <option>Slovenia</option>
                    <option>Solomon Islands</option>
                    <option>Somalia</option>
                    <option>South Africa</option>
                    <option>South Georgia and the South Sandwich Islands</option>
                    <option>South Sudan</option>
                    <option>Spain</option>
                    <option>Sri Lanka</option>
                    <option>Sudan</option>
                    <option>Suriname</option>
                    <option>Svalbard and Jan Mayen</option>
                    <option>Swaziland</option>
                    <option>Sweden</option>
                    <option>Switzerland</option>
                    <option>Syrian Arab Republic</option>
                    <option>Taiwan, Province of China</option>
                    <option>Tajikistan</option>
                    <option>Tanzania, United Republic of</option>
                    <option>Thailand</option>
                    <option>Timor-Leste</option>
                    <option>Togo</option>
                    <option>Tokelau</option>
                    <option>Tonga</option>
                    <option>Trinidad and Tobago</option>
                    <option>Tunisia</option>
                    <option>Turkey</option>
                    <option>Turkmenistan</option>
                    <option>Turks and Caicos Islands</option>
                    <option>Tuvalu</option>
                    <option>Uganda</option>
                    <option>Ukraine</option>
                    <option>United Arab Emirates</option>
                    <option>United Kingdom</option>
                    <option>United States</option>
                    <option>United States Minor Outlying Islands</option>
                    <option>Uruguay</option>
                    <option>Uzbekistan</option>
                    <option>Vanuatu</option>
                    <option>Venezuela</option>
                    <option>Viet Nam</option>
                    <option>Virgin Islands, British</option>
                    <option>Virgin Islands, U.s.</option>
                    <option>Wallis and Futuna</option>
                    <option>Western Sahara</option>
                    <option>Yemen</option>
                    <option>Zambia</option>
                    <option>Zimbabwe</option>
                        </select>
                    <div className="select_arrow"></div>
                </div>
            </div>
        )
    }

    const renderEditStepper = () => {
        const stepsDescription = ['Edit your information', 'Confirm your password', ''];

        return (
            <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepOptional(index)) {
                    labelProps.optional = (
                    <Typography variant="caption"></Typography>
                    );
                }
                return (
                    <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - successfully updated
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleRefresh}>Profile</Button>
                </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                    {stepsDescription[activeStep]}
                </Typography>
                {activeStep == 0 ? renderEditUserInformation() : <></>}
                {activeStep == 1 ? renderConfirmPassword() : <></>}
                {activeStep == 2 ? renderConfirmUpdate() : <></>}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    {
                        activeStep != 0 ?
                        <Button
                            color="inherit"
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button> 
                        :
                        <></>
                    }
                    <Box sx={{ flex: '1 1 auto' }} />
        
                    <Button onClick={async () => {await handleNext()}}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
                </React.Fragment>
            )}
            </Box>        
        );
    }

    const renderConfirmUpdate = () => {
        return (
            <div className='renderConfirmUpdate'>
                <div className='renderConfirmUpdateLabel'>
                    Are you sure you want to edit information ?
                </div>
                <div>
                    <Checkbox {...label} id='confirmUpdateBtn'/>
                </div>
                <span id='confirmUpdateErrorMessage' className='errorMessage'></span>
            </div>
        )
    }

    return (
        <div className="userProfile">
            <h1>
                Your Profile 
                <CgProfile className='profileIcon' size={50}/>
            </h1>
            <div className='userInformation'>
                {
                    renderEditStepper()
                }
            </div>
        </div>
    );
}

export default UserProfile;