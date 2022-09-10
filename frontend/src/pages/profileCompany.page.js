import NavigationBar from "../components/navigationBar.component";
import { useEffect, useState } from "react";
import { fetchData } from "../services/fetch.service";
import CompanyProfile from "../components/profileCompany.component";

const ProfileCompany = () => {
  const [loggedEntity, setLoggedEntity] = useState([]);

  useEffect(() => {
    const getApiData = async () => {
        var response;
        var id;

        if(localStorage.getItem('loggedEntity') == 'company') {
            id = localStorage.getItem('companyId');
            response = await (await fetchData(`companys/${id}`)).json();
        }
        
        setLoggedEntity(response);
    }

    getApiData();
  }, []);
    return (
      <>
        <div className="profileCompany">
            <NavigationBar/>
            <CompanyProfile company={loggedEntity}/>
        </div>
      </>
    )
  }
  
  export default ProfileCompany;