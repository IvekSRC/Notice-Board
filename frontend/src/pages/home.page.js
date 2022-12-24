import React, { useRef } from "react";
import NavigationBar from "../components/navigationBar.component";
import { fetchData } from "../services/fetch.service";
import { useState, useEffect } from "react";
import Announcement from "../components/announcement.component";
import { isLogged, loggedEntity } from "../services/auth.services";
import TablePagination from '@mui/material/TablePagination';
import CreateAnnouncementForm from "../components/createAnnouncementForm.component";
import { Autocomplete, TextField } from "@mui/material";
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import PageviewIcon from '@mui/icons-material/Pageview';
import { blue } from '@mui/material/colors';
import { FaMicrophone } from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [myAnnouncements, setMyAnnouncements] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [tags, setTags] = useState([]);
    const [searchByTags, setSearchByTags] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [numberOfAnnouncements, setNumberOfAnnouncements] = useState(0);
    const [isExpanded, setIsExpanded] = useState(true);
    const [sortBy, setSortBy] = useState('_id');
    const [sortOrder, setSortOrder] = useState(1);
    const [displayOption, setDisplayOption] = useState(-1);
    const microphoneRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [searchParam, setSearchParam] = useState(null);

    useEffect(() => {
        const getApiData = async () => {
            var sortCriterium = `?limit=${rowsPerPage}&skip=${page * rowsPerPage}&sortProps[0]=${sortBy}&sortOrder[0]=${sortOrder}`;
            if(searchByTags.length != 0) {
                searchByTags.forEach((tag, index) => {
                    sortCriterium += `&searchByTags[${index}]=${tag}`
                });
            }
            if(searchParam) {
                sortCriterium += `&search=${searchParam}`
            }

            var fetchAnnouncements = await (await fetchData(`announcements${sortCriterium}`)).json();
            setAnnouncements(fetchAnnouncements.Items);
            setNumberOfAnnouncements(fetchAnnouncements.TotalPages);

            if(isLogged() == true) {
                if(loggedEntity() == 'company' && displayOption == 1) {
                    const token = localStorage.getItem('token');
                    fetchAnnouncements = await (await fetchData(`announcements/all/me${sortCriterium}`, 'GET', undefined, token)).json();
                    setMyAnnouncements(fetchAnnouncements.Items);
                    setNumberOfAnnouncements(fetchAnnouncements.TotalPages);
                } else if (loggedEntity() == 'user' && displayOption == 1) {
                    const token = localStorage.getItem('token');
                    fetchAnnouncements = await (await fetchData(`announcements/favorites/all${sortCriterium}`, 'GET', undefined, token)).json();
                    setFavorites(fetchAnnouncements.Items);
                    setNumberOfAnnouncements(fetchAnnouncements.TotalPages);
                }
            }

            const fetchTags = await (await fetchData('announcements/tags/all')).json();
            setTags(fetchTags);
        }

        getApiData();
    }, [rowsPerPage, page, sortBy, sortOrder, searchByTags, displayOption, searchParam]);

    const renderAnnouncements = (listOfAnnouncements) => {
        return (
            <div className="homePage">
                <div className="sortingPart">
                    { renderFilterPart() }
                </div>
                <div className="searchingPart">
                    { renderSearchPart() }
                </div>
                <div className="announcements">
                    {listOfAnnouncements.map((announcement) => (
                            announcement.status == true ?
                            <div className="announcement" key={announcement._id}>
                                <Announcement announcement={announcement}/>
                            </div> 
                            :
                            <div key={announcement._id}></div>
                    ))}
                </div>
            </div>
        )
    }

    const renderFilterPart = () => {
        return (
            <>
                <Avatar className="sortIcon" sx={ { bgcolor: blue[500] } }>
                    <PageviewIcon />
                </Avatar>
                <Autocomplete
                    disablePortal
                    className="sortBy"
                    options={[
                        "Name",
                        "Category",
                        "End Time"
                    ]}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Sort By" />}
                    onChange={(event, value) => changeSortByCriterium(value)}
                />
                <Autocomplete
                    disablePortal
                    className="sortOrder"
                    options={[
                        "Ascending",
                        "Descending",
                    ]}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Sort Order" />}
                    onChange={(event, value) => changeSortByOrder(value)}
                />
                <Autocomplete
                    multiple
                    className="sortByTags"
                    options={tags}
                    getOptionLabel={option => option.title}
                    isOptionEqualToValue={(option, value) => option.title === value.title}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="Tags"
                        />
                    )}
                    onChange={filterByTags}
                />
                {
                    loggedEntity() == 'company' ? 
                    <Button onClick={changeDisplayAnnouncements} className='displayAllAnnouncements'>
                        {
                            displayOption == 1 ?
                            <span className="showAnnouncementOption">Show all Announcements</span>
                            :
                            <span className="showAnnouncementOption">Show just my Announcements</span>
                        }
                    </Button> : <></>
                }
                {
                    loggedEntity() == 'user' ? 
                    <Button onClick={changeDisplayAnnouncements} className='displayAllAnnouncements'>
                        {
                            displayOption == 1 ?
                            <span className="showFavoritesOption">Show all Announcements</span>
                            :
                            <span className="showFavoritesOption">Favorites</span>
                        }
                    </Button> : <></>
                }
            </>
        )
    }

    const renderSearchPart = () => {
        return (
            <div className="microphone-wrapper">
                <div className="mircophone-container">
                    <div className="searchPart">
                        <input type="text" placeholder="Search" className="searchParam" id="searchParam"/>
                        <SearchIcon className="searchBtn" onClick={changeSearchParam}/>
                    </div>
                    <div className="microphone-icon-container" ref={microphoneRef} onClick={handleListing}>
                        <FaMicrophone className='microphone-icon'/>
                    </div>
                    <div className="microphone-status">
                        {isListening ? "Listening ............." : "Click to start Listening"}
                    </div>
                    {isListening && (
                        <button className="microphone-stop microphone-btn" onClick={stopHandle}>
                            Stop
                        </button>
                    )}
                </div>
            </div>
        )
    }

    const changeSearchParam = () => {
        const search = document.getElementById('searchParam').value;
        setSearchParam(search);
    }

    const handleListing = () => {
        handleReset();
        setIsListening(true);
        microphoneRef.current.classList.add("listening");
        SpeechRecognition.startListening({
            continuous: true,
        });
    };

    const stopHandle = () => {
        setIsListening(false);
        microphoneRef.current.classList.remove("listening");
        SpeechRecognition.stopListening();
        document.getElementById('searchParam').value = transcript;
    };

    const handleReset = () => {
        stopHandle();
        resetTranscript();
    };

    const changeDisplayAnnouncements = () => {
        setDisplayOption(displayOption * (-1));
        setPage(0);
    }

    const filterByTags = (event, values) => {
        var tags = [];
        values.forEach(tag => {
            tags.push(tag.title);
        });

        setSearchByTags(tags);
    }

    const changeSortByCriterium = (value) => {
        setSortBy(toCamelCase(value));
    }

    const changeSortByOrder = (value) => {
        if(value == 'Ascending') {
            setSortOrder(1);
        }
        else if(value == 'Descending') {
            setSortOrder(-1);
        }
    }

    const toCamelCase = (string) => {
        return string 
            .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
            .replace(/\s/g, '')
            .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
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
                            <CreateAnnouncementForm tags={tags}/>
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
                            displayOption == 1 ?
                            renderAnnouncements(favorites) : renderAnnouncements(announcements)
                        :
                            displayOption == 1 ? renderCompanyAnnouncements(myAnnouncements) : renderCompanyAnnouncements(announcements)
                    }
                </>
                :
                renderAnnouncements(announcements)
            }

            <TablePagination
                className="pagination"
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