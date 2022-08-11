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

module.exports = {
    isLogged,
    logOut
};