const validateRequiredField = (field, minLength, errorField) => {
    const emptyInput = '';
    var placeHolder = field.placeholder;
    const requiredMessage = 'is required field';

    if(field.value == emptyInput) {
      field.style.border = '2px solid red';
      if(!field.placeholder.includes(requiredMessage)) {
        field.placeholder = `${placeHolder} ${requiredMessage}`
      }
      
      return false;
    } else {
      if(field.value.length < minLength) {
        field.style.border = '2px solid red';
        if(field.placeholder.includes(requiredMessage)) {
          placeHolder = field.placeholder.replace(requiredMessage, '');
        }
        errorField.innerHTML = `${placeHolder} must contain minimum ${minLength} characters`;
        errorField.color = 'red';
        
        return false;
      }
      field.style.border = '1px solid black';
      if(field.placeholder.includes(requiredMessage)) {
        field.placeholder.replace(requiredMessage, '');
      }
      if(errorField) {
        errorField.innerHTML = '';
      }

      return true;
    }
}

module.exports = {
  validateRequiredField
}