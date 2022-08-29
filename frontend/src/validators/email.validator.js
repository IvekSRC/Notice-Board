const validateEmail = (email, errorField) => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(email.value.match(mailformat)) {
        email.parentElement.style.border = '1px solid black';
        errorField.innerHTML = '';

        return true;
    }
    else {
        email.parentElement.style.border = '2px solid red';
        errorField.innerHTML = 'Email is incorrect';
        errorField.color = 'red';
        
        return false;
    }
}

module.exports = {
    validateEmail
}