import { fetchData } from "../services/fetch.service";
import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { MdFavorite, MdFavoriteBorder, MdViewArray } from 'react-icons/md';
import SendIcon from '@mui/icons-material/Send';

const Announcement = (announcement) => {
    const [picture, setPicture] = useState();
    const [open, setOpen] = React.useState(false);
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        const getApiData = async () => {
            const response = await fetchData(`announcements/${announcement.announcement._id}/publicPicture`);
            const imageBlob = await response.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            setPicture(imageObjectURL);

            if(localStorage.getItem('loggedEntity') == 'user') {
                const token = localStorage.getItem('token');
                const res = await (await fetchData(`announcements/favorites/get/${announcement.announcement._id}`, 'GET', undefined, token)).json();
                setIsAdded(res.isAdded);
            }
        }

        getApiData();
    }, [isAdded]);

    const deleteAnnouncement = async () => {
        const token = localStorage.getItem('token');
        await fetchData(`announcements/${announcement.announcement._id}`, 'DELETE', undefined, token);
        window.location.replace('/');
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const addToFavorites = async () => {
        const token = localStorage.getItem('token');
        await fetchData(`announcements/favorites/add/${announcement.announcement._id}`, 'PATCH', undefined, token);
        setIsAdded(true);
    }

    const removeFromFavorites = async () => {
        const token = localStorage.getItem('token');
        await fetchData(`announcements/favorites/delete/${announcement.announcement._id}`, 'PATCH', undefined, token);
        setIsAdded(false);
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#80e8ff',
        border: '2px solid #000',
        borderRadius: '10px',
        boxShadow: 24,
        p: 4,
    };

    const isExpireInThreeDays = (expireTime) => {
        const dateForCompare = new Date(Date.now());
        const threeDays = 3;
        dateForCompare.setDate(dateForCompare.getDate() + threeDays);

        if(dateForCompare >= expireTime) {
            return true;
        } else {
            return false;
        }
    }

    const setDateType = () => {
        const endTime = document.getElementById('extendEndTime');
        endTime.type = 'date';
    }

    const extendEndeTime = async () => {
        var newTime = document.getElementById('extendEndTime');
        const errorMessage = document.getElementById('extendEndTimeErrorMessage');

        if(!newTime.value) {
            errorMessage.innerHTML = 'Please select value for new end time.';
        } else {
            errorMessage.innerHTML = '';
            
            const currentEndTime = new Date(announcement.announcement.endTime);
            newTime = new Date(newTime.value);

            if(currentEndTime >= newTime) {
                errorMessage.innerHTML = 'Time must be greater than current end time.';
            } else {
                const token = localStorage.getItem('token');
                await fetchData(`announcements/${announcement.announcement._id}/extendTime`, 'PATCH', { newTime: newTime }, token);
                
                window.location.replace('/');
            }
        }
    }

    return (
        <>
            <div className="announcementName">
                <h3>
                    {announcement.announcement.name}
                </h3>
            </div>
            {
                <img src={picture} className="announcementPicture"/>
            }
            <p className="displayProp">
                Category:  
                <span className="displayPropValue">
                    {` ${announcement.announcement.category}`}
                </span>
            </p>
            <p className="displayProp">
                Created in
                <span className="displayPropValue">
                    {` ${new Date(announcement.announcement.startTime).toDateString()}`}
                </span>
            </p>
            <div>
                {
                    isExpireInThreeDays(new Date(announcement.announcement.endTime)) == true ?
                    <div className="endTimeExpire">
                        Announcement expire in 3 days
                    </div>
                    : 
                    <span className="displayPropValue">
                        Expire in {` ${new Date(announcement.announcement.endTime).toDateString()}`}
                    </span>
                }
            </div>
            <div className='seeMoreDetails'>
                <Button onClick={handleOpen}>See more details</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" className="modalName">
                        {announcement.announcement.name}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Description: {announcement.announcement.description}
                    </Typography>
                    {
                        (localStorage.getItem('loggedEntity') == 'company' && isExpireInThreeDays(new Date(announcement.announcement.endTime))) == true ?
                        <div className="modalExpireEndTime">
                            <Typography className="displayPropValueExpire">
                                Your announcement expire in {` ${new Date(announcement.announcement.endTime).toDateString()}`}
                            </Typography>
                            <div>
                                <div className="extendEndTime">
                                    <div className="extendInput"> 
                                        <input type="text" name="extendEndTime" required id='extendEndTime' onFocus={setDateType} placeholder="Extend your announcement"/>
                                    </div>
                                    <div>
                                        <Button variant="contained" endIcon={<SendIcon/>} className='extendBtn' onClick={extendEndeTime}>
                                            Extend
                                        </Button>
                                    </div>
                                </div>
                                <div id='extendEndTimeErrorMessage' className='errorMessageExtendTime'></div>
                            </div>
                        </div>
                        :
                        <></>
                    }
                    </Box>
                </Modal>
                {
                    localStorage.getItem('loggedEntity') == 'company' && localStorage.getItem('companyId') == announcement.announcement.companyId ?
                    <div className="deleteAnnouncement">
                        <IconButton aria-label="delete" onClick={deleteAnnouncement}>
                            <DeleteIcon />
                        </IconButton>
                    </div> : <></>
                }
                {
                    localStorage.getItem('loggedEntity') == 'user' && isAdded == true ?
                    <MdFavorite className='favorites' onClick={removeFromFavorites}/> : <></>
                }
                {
                    localStorage.getItem('loggedEntity') == 'user' && isAdded == false ?
                    <MdFavoriteBorder className='favorites' onClick={addToFavorites}/> : <></>
                }
            </div>
        </>
    )
}

export default Announcement;