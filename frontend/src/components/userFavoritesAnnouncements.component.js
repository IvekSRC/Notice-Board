import { TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchData } from "../services/fetch.service";
import Announcement from "./announcement.component";

const UserFavoritesAnnouncements = (user) => {
    const [favorites, setFavorites] = useState([]);
    const [numberOfAnnouncements, setNumberOfAnnouncements] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const getApiData = async () => {
            var sortCriterium = `?limit=${rowsPerPage}&skip=${page * rowsPerPage}`;

            const token = localStorage.getItem('token');
            const fetchAnnouncements = await (await fetchData(`announcements/favorites/all${sortCriterium}`, 'GET', undefined, token)).json();
            setFavorites(fetchAnnouncements.Items);
            setNumberOfAnnouncements(fetchAnnouncements.TotalPages);
        }

        getApiData();
    }, [rowsPerPage, page]);

    const renderAnnouncements = (listOfAnnouncements) => {
        return (
            <div className="homePage">
                {/* <div className="sortingPart">
                    { renderFilterPart() }
                </div> */}
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