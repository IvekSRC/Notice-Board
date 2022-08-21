const validatePassword = (password, repeatPassowrd, errorField) => {
    if(password.value != repeatPassowrd.value) {
      repeatPassowrd.parentElement.style.border = '2px solid red';
      errorField.innerHTML = "Password do not match.";

      return false;
    } else {
      repeatPassowrd.parentElement.style.border = '1px solid black';
      errorField.innerHTML = "";

      return true;
    }
}

module.exports = validatePassword;