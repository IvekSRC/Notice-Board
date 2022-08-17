import { fetchData } from "../services/fetch.service";
import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const Announcement = (announcement) => {
    const [picture, setPicture] = useState();

    useEffect(() => {
        const getApiData = async () => {
            const response = await fetchData(`announcements/${announcement.announcement._id}/publicPicture`);
            const imageBlob = await response.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            setPicture(imageObjectURL);
        }

        getApiData();
    }, []);

    const deleteAnnouncement = async () => {
        const token = localStorage.getItem('token');
        await fetchData(`announcements/${announcement.announcement._id}`, 'DELETE', undefined, token);
        window.location.replace('/');
    }

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
                Description: 
                <span className="displayPropValue">
                    {` ${announcement.announcement.description}`}
                </span>
            </p>
            <p className="displayProp">
                Start Time: 
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
        </>
    )
}

export default Announcement;