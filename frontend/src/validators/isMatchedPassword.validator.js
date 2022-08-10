const isMatchedPassowrd = (password, repeatPassowrd) => {
    if(password.value != repeatPassowrd.value) {
      repeatPassowrd.parentElement.style.border = '2px solid red';
      repeatPassowrd.type = "text";
      password.type = "text"
      repeatPassowrd.value = ""
      repeatPassowrd.placeholder = "Passwords do not match"

      return false;
    } else {
      repeatPassowrd.parentElement.style.border = '1px solid black';
      repeatPassowrd.type = "password";
      password.type = "password";

      return true;
    }
}

module.exports = isMatchedPassowrd;