import { useEffect, useState } from "react";
import NavigationBar from "../components/navigationBar.component";
import UserProfile from "../components/profileUser.component";
import UserFavoritesAnnouncements from "../components/userFavoritesAnnouncements.component";
import { fetchData } from "../services/fetch.service";

const ProfileUser = () => {
  const [loggedEntity, setLoggedEntity] = useState([]);

  useEffect(() => {
    const getApiData = async () => {
        var response;
        var id;

        if(localStorage.getItem('loggedEntity') == 'user') {
            id = localStorage.getItem('userId');
            response = await (await fetchData(`users/${id}`)).json();
        }
        
        setLoggedEntity(response);
    }

    getApiData();
  }, []);

  return (
    <>
      <div className="profileUser">
        <NavigationBar/>
        <UserProfile user={loggedEntity}/>
        <UserFavoritesAnnouncements user={loggedEntity}/>
      </div>
    </>
  )
}

export default ProfileUser;