import { CgProfile } from 'react-icons/cg';

const UserProfile = (user) => {
    return (
        <div className="userProfile">
            <h1>
                Your Profile 
                <CgProfile className='profileIcon' size={50}/>
            </h1>
            <div className='userInformation'>
                <span>
                    <span>
                        First Name: 
                    </span>
                    {user.user.firstName}
                </span>
                <span>
                    <span>
                        Last Name: 
                    </span>
                    {user.user.lastName}
                </span>
                <span>
                    <span>
                        Nick Name: 
                    </span>
                    {user.user.nickName}
                </span>
                <span>
                    <span>
                        Gender: 
                    </span>
                    {user.user.gender}
                </span>
                <span>
                    <span>
                        Country:
                    </span>
                    {user.user.country}
                </span>
            </div>
        </div>
    );
}

export default UserProfile;