const { validateEmail } = require('./email.validator');
const { validatePassword } = require('./password.validator');
const { validateRequiredField } = require('./requiredField.validator');

module.exports = {
    validateEmail,
    validatePassword,
    validateRequiredField
}