import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { fetchData } from '../services/fetch.service';
import isMatchedPassowrd from '../validators/isMatchedPassword.validator';
import validateRequiredField from '../validators/validateRequiredField.validator';

const RegisterForm = () => {
  const registerCompany = async () => {
      // Collect require data
      const firstName = document.getElementById('registerFirstName');
      const lastName = document.getElementById('registerLastName');
      const companyName = document.getElementById('registerCompanyName');
      const email = document.getElementById('registerCompanyEmail');
      const password = document.getElementById('registerCompanyPassword');
      const repeatPassowrd = document.getElementById('registerCompanyRepeatPassword');

      // Validation - Required Data
      var isValid = true;
      if(validateRequiredField(firstName) == false) {
        isValid = false;
      }
      if(validateRequiredField(lastName) == false) {
        isValid = false;
      }
      if(validateRequiredField(companyName) == false) {
        isValid = false;
      }
      if(validateRequiredField(email) == false) {
        isValid = false;
      }
      if(validateRequiredField(password) == false) {
        isValid = false;
      }
      if(validateRequiredField(repeatPassowrd) == false) {
        isValid = false;
      }

      var termsChecked = document.getElementById('cb1');
      var termsLabel = document.getElementById('termsLabel');
      if(termsChecked.checked == false) {
        termsLabel.style.color = "red";
        isValid = false;
      } else {
        termsLabel.style.color = "black";
      }
      
      if(isValid == false) {
        return;
      }

      // Validation - Match Passowrd
      if(!isMatchedPassowrd(password, repeatPassowrd)) {
        return;
      }

      var gender = undefined;
      if(document.getElementById('registerGenderMale').checked) {
        gender = document.getElementById('registerGenderMale').value;
      } else if (document.getElementById('registerGenderFemale').checked) {
        gender = document.getElementById('registerGenderFemale').value;
      }
      
      var country = document.getElementById('country').value;
      if(country == 'Select country') {
        country = undefined;
      }

      const newCompany = {
        email: email.value,
        password: password.value,
        name: companyName.value,
        firstName: firstName.value,
        lastName: lastName.value,
        gender: gender,
        country: country
      }

      console.log(newCompany);
      
      const response =  await (await fetchData('companys/register', 'POST', newCompany)).json();

      console.log(response)
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('email', response.company.email);
      localStorage.setItem('firstName', response.company.firstName);
      localStorage.setItem('lastName', response.company.lastName);
      localStorage.setItem('companyName', response.company.name);
      localStorage.setItem('gender', response.company.gender);
      localStorage.setItem('country', response.company.country);
      localStorage.setItem('loggedEntity', 'company');

      window.location.replace('/');
  }

  return (
    <div className="form_wrapper">
      <div className="form_container">
        <div className="title_container">
          <h2 className='registerHeader'>Register Company</h2>
        </div>
        <div className="row clearfixx">
          <div className='registerCompanyForm'>
            <form className='registerCompanyForm'>
              <div className="input_field"> <span><i aria-hidden="true" className="fa fa-user"><FaUser className='registrationIcon'/></i></span>
                <input type="text" name="firstName" placeholder="First Name" required id='registerFirstName' minLength={2}/>
              </div>
              <div className="input_field"> <span><i aria-hidden="true" className="fa fa-user"><FaUser className='registrationIcon'/></i></span>
                <input type="text" name="lastName" placeholder="Last Name" required id='registerLastName' minLength={2}/>
              </div>
              <div className="input_field"> <span><i aria-hidden="true" className="fa fa-user"><FaUser className='registrationIcon'/></i></span>
                <input type="text" name="companyName" placeholder="Company name" required id='registerCompanyName' minLength={3}/>
              </div>
              <div className="input_field"> <span><i aria-hidden="false" className="fa fa-envelope"><FaEnvelope className='registrationIcon'/></i></span>
                <input type="email" name="email" placeholder="Email" required id='registerCompanyEmail' />
              </div>
              <div className="input_field"> <span><i aria-hidden="true" className="fa fa-lock"><FaLock className='registrationIcon'/></i></span>
                <input type="password" name="password" placeholder="Password" required id='registerCompanyPassword' minLength={7}/>
              </div>
              <div className="input_field"> <span><i aria-hidden="true" className="fa fa-lock"><FaLock className='registrationIcon'/></i></span>
                <input type="password" name="password" placeholder="Re-type Password" required id='registerCompanyRepeatPassword' minLength={7}/>
              </div>
              <div className="input_field radio_option">
                <input type="radio" name="radiogroup1" id="registerGenderMale" value='Male'/>
                <label htmlFor="registerGenderMale">Male</label>
                <input type="radio" name="radiogroup1" id="registerGenderFemale" value='Female'/>
                <label htmlFor="registerGenderFemale">Female</label>
              </div>
                  <div className="input_field select_option">
                  <select id="country" name="country">
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
                <div className="input_field checkbox_option">
                  <input type="checkbox" id="cb1"/>
              <label htmlFor="cb1" id='termsLabel'>I agree with terms and conditions</label>
                </div>
                <div className="input_field checkbox_option">
                  <input type="checkbox" id="cb2"/>
              <label htmlFor="cb2">I want to receive the newsletter</label>
                </div>
              <input className="button registerCompanyButton" type="button" value="Register" onClick={registerCompany}/>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;