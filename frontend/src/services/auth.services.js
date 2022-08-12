const isLogged = () => {
    if(localStorage.getItem('token') != '') {
      return true;
    }

    return false;
}

const logOut = () => {
    localStorage.clear();
    localStorage.setItem('token', '');
}

const loggedEntity = () => {
    if(localStorage.getItem('loggedEntity') == 'user') {
        return 'user';
    } 
    else if(localStorage.getItem('loggedEntity') == 'company') {
        return 'company';
    }
}

module.exports = {
    isLogged,
    logOut,
    loggedEntity
};