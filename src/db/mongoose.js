const mongoose = require('mongoose');
const { MONGODB_URL } = require('../../config');

mongoose.connect(MONGODB_URL, function(error) {
    if(error) {
        throw new Error("Unable to connect.")
    }
});