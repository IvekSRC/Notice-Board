import React from "react";
import NavigationBar from "../components/navigationBar.component";
import { fetchData } from "../services/fetch.service";
import { useState, useEffect } from "react";
import Announcement from "../components/announcement.component";

const Home = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const getApiData = async () => {
            const response = await (await fetchData('announcements')).json();
            setAnnouncements(response.Items);
        }

        getApiData();
    }, []);

    return (
    <>
        <div>
            <NavigationBar />

            <p>{localStorage.getItem('token')}</p>
            <p>{console.log(announcements)}</p>
            <div className="announcements">
                {announcements.map((announcement) => (
                    <div className="announcement" key={announcement._id}>
                        <Announcement announcement={announcement}/>
                    </div>
                ))}
            </div>
        </div>
    </>
    )
}

export default Home;