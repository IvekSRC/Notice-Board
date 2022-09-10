import { TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchData } from "../services/fetch.service";
import Announcement from "./announcement.component";
import Avatar from '@mui/material/Avatar';
import PageviewIcon from '@mui/icons-material/Pageview';
import { blue } from '@mui/material/colors';
import { Autocomplete, TextField } from "@mui/material";

const UserFavoritesAnnouncements = (user) => {
    const [favorites, setFavorites] = useState([]);
    const [numberOfAnnouncements, setNumberOfAnnouncements] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState('_id');
    const [sortOrder, setSortOrder] = useState(1);
    const [tags, setTags] = useState([]);
    const [searchByTags, setSearchByTags] = useState([]);

    useEffect(() => {
        const getApiData = async () => {
            var sortCriterium = `?limit=${rowsPerPage}&skip=${page * rowsPerPage}&sortProps[0]=${sortBy}&sortOrder[0]=${sortOrder}`;
            if(searchByTags.length != 0) {
                searchByTags.forEach((tag, index) => {
                    sortCriterium += `&searchByTags[${index}]=${tag}`
                });
            }
            
            const token = localStorage.getItem('token');
            const fetchAnnouncements = await (await fetchData(`announcements/favorites/all${sortCriterium}`, 'GET', undefined, token)).json();
            setFavorites(fetchAnnouncements.Items);
            setNumberOfAnnouncements(fetchAnnouncements.TotalPages);                

            const fetchTags = await (await fetchData('announcements/tags/all')).json();
            setTags(fetchTags);
        }

        getApiData();
    }, [rowsPerPage, page, sortBy, sortOrder, searchByTags]);

    const renderAnnouncements = (listOfAnnouncements) => {
        return (
            <div className="homePage">
                <div className="sortingPart">
                    { renderFilterPart() }
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
            </>
        )
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

    const filterByTags = (event, values) => {
        var tags = [];
        values.forEach(tag => {
            tags.push(tag.title);
        });

        setSearchByTags(tags);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            {renderAnnouncements(favorites)}
            <TablePagination
                className="pagination"
                component="div"
                count={numberOfAnnouncements * rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    )
}

export default UserFavoritesAnnouncements;