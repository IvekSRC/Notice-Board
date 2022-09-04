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
        const entity = localStorage.getItem('loggedEntity');

        if(entity == 'user') {
            id = localStorage.getItem('userId');
            response = await (await fetchData(`users/${id}`)).json();
        } else if(entity == 'company') {
            id = localStorage.getItem('companyId');
            response = await (await fetchData(`companys/${id}`)).json();
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