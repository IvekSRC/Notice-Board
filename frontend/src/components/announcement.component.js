import { fetchData } from "../services/fetch.service";
import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

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
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
            <div>
                <h3 className="announcementName">
                    {announcement.announcement.name}
                </h3>
                {
                    localStorage.getItem('loggedEntity') == 'company' && localStorage.getItem('companyId') == announcement.announcement.companyId ?
                    <IconButton aria-label="delete" onClick={deleteAnnouncement}>
                        <DeleteIcon />
                    </IconButton> :
                    <></>
                }
                {
                    localStorage.getItem('loggedEntity') == 'user' && isAdded == true ?
                    <MdFavorite className='registrationIcon' onClick={removeFromFavorites}/> : <></>
                }
                {
                    localStorage.getItem('loggedEntity') == 'user' && isAdded == false ?
                    <MdFavoriteBorder className='registrationIcon' onClick={addToFavorites}/> : <></>
                }
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
                Announcement created: 
                <span className="displayPropValue">
                    {` ${new Date(announcement.announcement.startTime).toDateString()}`}
                </span>
            </p>
            <p className="displayProp">
                End Time: 
                <span className="displayPropValue">
                    {` ${new Date(announcement.announcement.endTime).toDateString()}`}
                </span>
            </p>

            <div>
                <Button onClick={handleOpen}>See more details</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {announcement.announcement.name}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {announcement.announcement.description}
                    </Typography>
                    </Box>
                </Modal>
            </div>
        </>
    )
}

export default Announcement;