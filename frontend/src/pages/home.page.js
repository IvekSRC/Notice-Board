import React from "react";
import NavigationBar from "../components/navigationBar.component";
import { fetchData } from "../services/fetch.service";
import { useState, useEffect } from "react";
import Announcement from "../components/announcement.component";
import { isLogged, loggedEntity } from "../services/auth.services";
import TablePagination from '@mui/material/TablePagination';
import CreateAnnouncementForm from "../components/createAnnouncementForm.component";
import { Autocomplete, TextField } from "@mui/material";
import Button from '@mui/material/Button';

const Home = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [myAnnouncements, setMyAnnouncements] = useState([]);

    const [tags, setTags] = useState([]);
    const [searchByTags, setSearchByTags] = useState([]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [numberOfAnnouncements, setNumberOfAnnouncements] = React.useState(0);

    const [isExpanded, setIsExpanded] = React.useState(true);

    const [sortBy, setSortBy] = React.useState('_id');
    const [sortOrder, setSortOrder] = React.useState(1);

    const [displayOption, setDisplayOption] = React.useState(1);

    useEffect(() => {
        const getApiData = async () => {
            var sortCriterium = `?limit=${rowsPerPage}&skip=${page * rowsPerPage}&sortProps[0]=${sortBy}&sortOrder[0]=${sortOrder}`;
            if(searchByTags.length != 0) {
                searchByTags.forEach((tag, index) => {
                    sortCriterium += `&searchByTags[${index}]=${tag}`
                });
            }

            var fetchAnnouncements = await (await fetchData(`announcements${sortCriterium}`)).json();
            setAnnouncements(fetchAnnouncements.Items);
            setNumberOfAnnouncements(fetchAnnouncements.TotalPages);

            if(isLogged() == true) {
                if(loggedEntity() == 'company' && displayOption == 1) {
                    const token = localStorage.getItem('token');
                    fetchAnnouncements = await (await fetchData(`announcementsme${sortCriterium}`, 'GET', undefined, token)).json();
                    setMyAnnouncements(fetchAnnouncements.Items);
                    setNumberOfAnnouncements(fetchAnnouncements.TotalPages);
                }
            }

            const fetchTags = await (await fetchData('announcementstags')).json();
            setTags(fetchTags);
        }

        getApiData();
    }, [rowsPerPage, page, sortBy, sortOrder, searchByTags, displayOption]);

    const renderAnnouncements = (listOfAnnouncements) => {
        return (
            <div>
                <div className="sortingPart">
                    { renderFilterPart() }
                </div>
                <div className="announcements">
                    {listOfAnnouncements.map((announcement) => (
                        <div className="announcement" key={announcement._id}>
                            <Announcement announcement={announcement}/>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const renderFilterPart = () => {
        return (
            <>
                <Autocomplete
                    disablePortal
                    className="sortBy"
                    options={[
                        "Name",
                        "Status",
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
                            <span>Show all Announcements</span>
                            :
                            <span>Show just my Announcements</span>
                        }
                    </Button> :
                    <Button disabled onClick={changeDisplayAnnouncements} className='displayAllAnnouncements'>Show all Announcements</Button>
                }
            </>
        )
    }

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
                        renderAnnouncements(announcements)
                        :
                        displayOption == 1 ?
                        renderCompanyAnnouncements(myAnnouncements)
                        :
                        renderCompanyAnnouncements(announcements)
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