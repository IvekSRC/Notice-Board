const validateRequiredField = (field) => {
    const emptyInput = '';
    const placeHolder = field.placeholder;
    const requiredMessage = 'is required field';

    if(field.value == emptyInput) {
      field.parentElement.style.border = '2px solid red';
      if(!field.placeholder.includes(requiredMessage)) {
        field.placeholder = `${placeHolder} ${requiredMessage}`
      }
      
      return false;
    } else {
      field.parentElement.style.border = '1px solid black';
      if(field.placeholder.includes(requiredMessage)) {
        field.placeholder.replace(requiredMessage, '');
      }

      return true;
    }
}

module.exports = validateRequiredField;