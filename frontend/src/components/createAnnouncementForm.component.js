import { MdDriveFileRenameOutline, MdOutlineCategory, MdOutlineDescription } from 'react-icons/md'
import { BiTimeFive } from 'react-icons/bi';
import { AiOutlineFileImage } from 'react-icons/ai'
import { fetchData } from '../services/fetch.service';
import validateRequiredField from '../validators/validateRequiredField.validator';
import { Autocomplete, TextField } from "@mui/material";
import Chip from '@mui/material/Chip';
import { useState } from "react";

const CreateAnnouncementForm = (tags) => {
    const [selectedTags, setTags] = useState([]);

    const collectTags = (event, values) => {
      var tags = [];
      values.forEach(tag => {
          tags.push(tag);
      });

      setTags(tags);
    }

    const createAnnouncement = async () => {
        // Collect require data
        const name = document.getElementById('createName');
        const category = document.getElementById('createCategory');
        const endTime = document.getElementById('createEndTime');
        const image = document.querySelector('#createImage');

        // Validation - Required Data
        var isValid = true;
        if(validateRequiredField(name) == false) {
          isValid = false;
        }
        if(validateRequiredField(endTime) == false) {
          isValid = false;
        }
        if(validateRequiredField(image) == false) {
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
          tags: selectedTags
        }
        
        const token = localStorage.getItem('token');
        const response = await (await fetchData('announcements', 'POST', newAnnouncement, token)).json();
        
        // Fetch method for upload picture
        const formData = new FormData();
        formData.append('picture', image.files[0]);
        const options = {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        }
        await fetch(`http://localhost:8080/announcements/${response._id}/picture`, options);
        
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
                  <select id="createCategory" name="cetegory" placeholder='Category' required>
                    <option value="Letovanje">Letovanje</option>
                    <option value="Zimovanje">Zimovanje</option>
                  </select>
                </div>
                <div className="input_field"> <span><i aria-hidden="true" className="fa fa-user"><MdOutlineDescription className='registrationIcon'/></i></span>
                  <input type="text" name="description" placeholder="Description" id='createDescription' maxLength={500}/>
                </div>
                <div className="input_field"> <span><i aria-hidden="false" className="fa fa-envelope"><BiTimeFive className='registrationIcon'/></i></span>
                  <input type="date" name="endTime" required id='createEndTime' />
                </div>
                <div className="input_field createAnnouncementFileInput"> <span><i aria-hidden="false" className="fa fa-envelope"><AiOutlineFileImage className='registrationIcon'/></i></span>
                  <input type="file" name="image" required id='createImage'/>
                </div>   
                <div className="chooseYourTags">             
                  <Autocomplete
                      className='chooseYourTagsChild'
                      multiple
                      id="tags-filled"
                      options={tags.tags.map((option) => option.title)}
                      freeSolo
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                      <TextField
                          {...params}
                          label="Tags"
                          placeholder="Choose your tags"
                      />
                      )}
                      onChange={collectTags}
                  />
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
                <input className="button registerCompanyButton" type="button" value="Create" onClick={createAnnouncement}/>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

export default CreateAnnouncementForm;