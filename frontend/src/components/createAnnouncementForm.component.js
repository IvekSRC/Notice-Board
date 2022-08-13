import { MdDriveFileRenameOutline, MdOutlineCategory, MdOutlineDescription } from 'react-icons/md'
import { BiTimeFive } from 'react-icons/bi';
import { fetchData } from '../services/fetch.service';
import isMatchedPassowrd from '../validators/isMatchedPassword.validator';
import validateRequiredField from '../validators/validateRequiredField.validator';

const CreateAnnouncementForm = () => {
    const createAnnouncement = async () => {
          // Collect require data
        const name = document.getElementById('createName');
        const category = document.getElementById('createCategory');
        const endTime = document.getElementById('createEndTime');

        // Validation - Required Data
        var isValid = true;
        if(validateRequiredField(name) == false) {
          isValid = false;
        }
        if(validateRequiredField(category) == false) {
          isValid = false;
        }
        if(validateRequiredField(endTime) == false) {
          isValid = false;
        }

        const description = document.getElementById('createDescription');

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

        var privateStatus = undefined;
        if(document.getElementById('createPrivateStatus').checked) {
          privateStatus = document.getElementById('createPrivateStatus').value;
        } else if (document.getElementById('createPublicStatus').checked) {
          privateStatus = document.getElementById('createPublicStatus').value;
        }

        const newAnnouncement = {
          name: name.value,
          category: category.value,
          description: description.value,
          endTime: endTime.value,
          status: privateStatus,
        }
        
        const token = localStorage.getItem('token');
        const response =  await (await fetchData('announcements', 'POST', newAnnouncement, token)).json();
        
        window.location.replace('/');
    }

    return (
      <div className="createAnnouncementForm">
        <div className="form_container">
          <div className="title_container">
            <h2 className='registerHeader'>Create Announcement</h2>
          </div>
          <div className="row clearfixx">
            <div className='registerUserForm'>
              <form className='registerUserForm'>
                <div className="input_field"> <span><i aria-hidden="true" className="fa fa-user"><MdDriveFileRenameOutline className='registrationIcon'/></i></span>
                  <input type="text" name="name" placeholder="Name" required id='createName' minLength={3}/>
                </div>
                <div className="input_field"> <span><i aria-hidden="true" className="fa fa-user"><MdOutlineCategory className='registrationIcon'/></i></span>
                  <input type="text" name="category" placeholder="Category" required id='createCategory' minLength={3}/>
                </div>
                <div className="input_field"> <span><i aria-hidden="true" className="fa fa-user"><MdOutlineDescription className='registrationIcon'/></i></span>
                  <input type="text" name="description" placeholder="Description" id='createDescription' maxLength={500}/>
                </div>
                <div className="input_field"> <span><i aria-hidden="false" className="fa fa-envelope"><BiTimeFive className='registrationIcon'/></i></span>
                  <input type="date" name="endTime" required id='createEndTime' />
                </div>
                <div className="input_field radio_option">
                  <input type="radio" name="radiogroup1" id="createPrivateStatus" value='Private'/>
                  <label htmlFor="createPrivateStatus">Private</label>
                  <input type="radio" name="radiogroup1" id="createPublicStatus" value='Public'/>
                  <label htmlFor="createPublicStatus">Public</label>
                </div>
                  <div className="input_field checkbox_option">
                      <input type="checkbox" id="cb1"/>
                      <label htmlFor="cb1" id='termsLabel'>I agree with terms and conditions</label>
                  </div>
                <input className="button registerCompanyButton" type="button" value="Register" onClick={createAnnouncement}/>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

export default CreateAnnouncementForm;