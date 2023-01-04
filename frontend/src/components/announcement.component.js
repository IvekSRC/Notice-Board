import { fetchData } from "../services/fetch.service";
import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { MdDriveFileRenameOutline, MdFavorite, MdFavoriteBorder, MdOutlineCategory, MdOutlineDescription } from 'react-icons/md';
import SendIcon from '@mui/icons-material/Send';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BiTimeFive } from "react-icons/bi";
import { validateRequiredField } from '../validators/requiredField.validator';

const Announcement = (announcement) => {
    const [picture, setPicture] = useState();
    const [open, setOpen] = React.useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [editModal, setEditModal] = React.useState(false);
    const [isMyItem, setIsMyItem] = useState(false);

    const [name, setName] = useState(announcement.announcement.name);
    const [category, setCategory] = useState(announcement.announcement.category);
    const [description, setDescription] = useState(announcement.announcement.description);
    const [endTime, setEndTime] = useState(announcement.announcement.endTime);

    useEffect(() => {
        const getApiData = async () => {
            const response = await fetchData(`announcements/${announcement.announcement._id}/publicPicture`);
            const imageBlob = await response.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            setPicture(imageObjectURL);

            const token = localStorage.getItem('token');
            if(localStorage.getItem('loggedEntity') === 'user') {
                const res = await (await fetchData(`announcements/favorites/get/${announcement.announcement._id}`, 'GET', undefined, token)).json();
                setIsAdded(res.isAdded);
            } else if(localStorage.getItem('loggedEntity') === 'company') {
                const res = await (await fetchData(`companys/announcements/isMy/${announcement.announcement._id}`, 'GET', undefined, token)).json();
                setIsMyItem(res.isMyItem);
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
    const handleClickOpen = () => { setDeleteModal(true); };
    const handleClickClose = () => { setDeleteModal(false); };
    const handleClickOpenEdit = () => { setEditModal(true); };
    const handleClickCloseEdit = () => { setEditModal(false); };

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

    const editAnnouncement = async () => {
        if(isValidChanges() === false) {
            return;
        }

        const updatedAnnouncement = {
            name: name,
            category: category,
            description: description,
            endTime: endTime
        }
        
        const token = localStorage.getItem('token');
        await fetchData(`announcements/${announcement.announcement._id}`, 'PATCH', updatedAnnouncement, token);
        window.location.reload(false);
    }

    const isValidChanges = () => {
        const name = document.getElementById('createName');
        const nameErrorField = document.getElementById('nameErrorMessage');

        var isValid = true;
        if(validateRequiredField(name, 2, nameErrorField) === false) {
          isValid = false;
        }

        return isValid;
    }

    const changeName = (event) => {
        setName(event.target.value);
    }

    const changeCategory = (event) => {
        setCategory(event.target.value);
    }

    const changeDescription = (event) => {
        setDescription(event.target.value);
    }

    const changeEndTime = (event) => {
        setEndTime(event.target.value);
    }

    return (
        <>
            <div className="announcementName">
                <h3>
                    {announcement.announcement.name}
                </h3>
            </div>
            {
                <div className="divForImage">
                    <img src={picture} alt="Announcement" className="announcementPicture"/>
                </div>
            }
            <p className="displayProp">
                Category:  
                <span className="displayPropValue">
                    {` ${announcement.announcement.category}`}
                </span>
            </p>
            <p className="displayProp">
                Created:
                <span className="displayPropValue">
                    {` ${new Date(announcement.announcement.startTime).toDateString()}`}
                </span>
            </p>
            <div>
                {
                    isExpireInThreeDays(new Date(announcement.announcement.endTime)) === true ?
                    <div className="endTimeExpire">
                        Expire in 3 days
                    </div>
                    : 
                    <div className="displayPropValue">
                        Expire in {` ${new Date(announcement.announcement.endTime).toDateString()}`}
                    </div>
                }
            </div>
            <div className='seeMoreDetails'>
                <Button onClick={handleOpen}>See more</Button>
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
                        {announcement.announcement.description}
                    </Typography>
                    {
                        isMyItem === true && isExpireInThreeDays(new Date(announcement.announcement.endTime)) === true ?
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
                        <Typography className="displayPropValueExpire">
                            Announcement expire in {` ${new Date(announcement.announcement.endTime).toDateString()}`}
                        </Typography>
                    }
                    </Box>
                </Modal>
                {
                    localStorage.getItem('loggedEntity') === 'company' && localStorage.getItem('companyId') === announcement.announcement.companyId ?
                    <div>
                        <IconButton aria-label="edit" onClick={handleClickOpenEdit}>
                            <EditIcon />
                        </IconButton>
                        <Dialog
                            open={editModal}
                            onClose={handleClickCloseEdit}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title" className="modalHeader editAnn">
                                {"Edit Announcement"}
                            </DialogTitle>
                            <DialogContent className="editAnn">
                            <div className="createAnnouncementForm editAnnouncementForm">
                                <div className="form_container">
                                    <div className="row clearfixx">
                                        <div className='registerUserForm'>
                                            <form className='registerUserForm'>
                                                <div className="input_field changeFieldAnn"> <span><i aria-hidden="true" className="fa fa-user"><MdDriveFileRenameOutline className='registrationIcon'/></i></span>
                                                    <input type="text" name="name" placeholder="Name" value={name} onChange={changeName} required id='createName' minLength={3}/>
                                                </div>
                                                <span id='nameErrorMessage' className='errorMessage'></span>
                                                <div className="input_field changeFieldAnn"> <span><i aria-hidden="true" className="fa fa-user"><MdOutlineCategory className='registrationIcon'/></i></span>
                                                    <select id="createCategory" name="cetegory" placeholder='Category' required value={category} onChange={changeCategory}>
                                                        <option value="Putovanje">Putovanje</option>
                                                        <option value="Posao">Posao</option>
                                                        <option value="Prodaja">Prodaja</option>
                                                        <option value="Usluga">Usluga</option>
                                                        <option value="Dogadjaj">Dogadjaj</option>
                                                        <option value="Objava">Objava</option>
                                                    </select>
                                                </div>
                                                <div className="input_field changeFieldAnn"> <span><i aria-hidden="true" className="fa fa-user"><MdOutlineDescription className='registrationIcon'/></i></span>
                                                    <input type="text" name="description" placeholder="Description" value={description} onChange={changeDescription} id='createDescription' maxLength={500}/>
                                                </div>
                                                <div className="input_field changeFieldAnn"> <span><i aria-hidden="false" className="fa fa-envelope"><BiTimeFive className='registrationIcon'/></i></span>
                                                    <input type="date" name="endTime" required id='createEndTime' value={endTime} onChange={changeEndTime} placeholder="Announcement expired date"/>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </DialogContent>
                            <DialogActions className="editAnn">
                                <Button onClick={handleClickCloseEdit}>Cancel</Button>
                                <Button onClick={editAnnouncement} autoFocus>
                                    Confirm
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <IconButton aria-label="delete" onClick={handleClickOpen}>
                            <DeleteIcon />
                        </IconButton>
                        <Dialog
                            open={deleteModal}
                            onClose={handleClickClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title" className="modalHeader">
                                {"Confirm delete modal"}
                            </DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this announcement ?
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClickClose}>Cancel</Button>
                            <Button onClick={deleteAnnouncement} autoFocus>
                                Confirm
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </div> : <></>
                }
                {
                    localStorage.getItem('loggedEntity') === 'user' && isAdded === true ?
                    <MdFavorite className='favorites' onClick={removeFromFavorites}/> : <></>
                }
                {
                    localStorage.getItem('loggedEntity') === 'user' && isAdded === false ?
                    <MdFavoriteBorder className='favorites' onClick={addToFavorites}/> : <></>
                }
            </div>
        </>
    )
}

export default Announcement;