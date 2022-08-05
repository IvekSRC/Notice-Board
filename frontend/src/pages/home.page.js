import React from "react";
import NavigationBar from "../components/navigationBar.component";
import { fetchData } from "../fetchData/fetchFunction";
import { useState, useEffect } from "react";

const Home = () => {
    const [announcements, setAnnouncements] = useState([]);

    // Fetch Announcements
    useEffect(() => {
        const getAnnouncements = async () => {
            const announcementsFromServer = await fetchData("announcements");
            setAnnouncements(announcementsFromServer);
        }

        getAnnouncements();
    }, []);

    return (
    <>
        <div>
            <NavigationBar />

            
        </div>
    </>
    )
}

export default Home;