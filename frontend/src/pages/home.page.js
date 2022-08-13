import React from "react";
import NavigationBar from "../components/navigationBar.component";
import { fetchData } from "../services/fetch.service";
import { useState, useEffect } from "react";
import Announcement from "../components/announcement.component";
import { isLogged, loggedEntity } from "../services/auth.services";
import TablePagination from '@mui/material/TablePagination';
import CreateAnnouncementForm from "../components/createAnnouncementForm.component";

const Home = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [myAnnouncements, setMyAnnouncements] = useState([]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [numberOfAnnouncements, setNumberOfAnnouncements] = React.useState(0);

    const [isExpanded, setIsExpanded] = React.useState(true);

    useEffect(() => {
        const getApiData = async () => {
            const fetchAnnouncements = await (await fetchData(`announcements?limit=${rowsPerPage}&skip=${page * rowsPerPage}`)).json();
            setAnnouncements(fetchAnnouncements.Items);
            setNumberOfAnnouncements(fetchAnnouncements.TotalPages);

            if(isLogged() == true) {
                if(loggedEntity() == 'company') {
                    const token = localStorage.getItem('token');
                    const fetchMyAnnouncements = await (await fetchData(`announcementsme?limit=${rowsPerPage}&skip=${page * rowsPerPage}`, 'GET', undefined, token)).json();
                    setMyAnnouncements(fetchMyAnnouncements.Items);
                    setNumberOfAnnouncements(fetchMyAnnouncements.TotalPages);
                }
            }
        }

        getApiData();
    }, [rowsPerPage, page]);

    const renderAnnouncements = (listOfAnnouncements) => {
        return (
            <div className="announcements">
                {listOfAnnouncements.map((announcement) => (
                    <div className="announcement" key={announcement._id}>
                        <Announcement announcement={announcement}/>
                    </div>
                ))}
            </div>
        )
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const changeStateOfButton = () => {
        const changeStage = !isExpanded;
        setIsExpanded(changeStage);
    }

    const renderCompanyAnnouncements = (listOfAnnouncements) => {
        return (
            <>
                <div className="createNewAnnouncement">
                    <button 
                        className={ isExpanded ? 'button-29 expanded' : 'button-29 collapsed' }
                        onClick={() => changeStateOfButton()}
                    >
                        { isExpanded ? 'Create new Announcement' : 'Collapse' }
                    </button>
                </div>
                <div>
                    { 
                        isExpanded ?
                        <></>
                        :
                        <>
                            <CreateAnnouncementForm/>
                        </>
                    }
                </div>
                <div className="announcements">
                    {renderAnnouncements(listOfAnnouncements)}
                </div>
            </>
        )
    }

    return (
    <>
        <div className="homeBackground">
            <NavigationBar />

            {
                isLogged() == true ? 
                <>
                    {
                        loggedEntity() == 'user' ?
                        renderAnnouncements(announcements)
                        :
                        renderCompanyAnnouncements(myAnnouncements)
                    }
                </>
                :
                renderAnnouncements(announcements)
            }

            <TablePagination
                component="div"
                count={numberOfAnnouncements * rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    </>
    )
}

export default Home;