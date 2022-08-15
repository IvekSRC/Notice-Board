const mongoose = require("mongoose");
const { ANNOUNCEMENT } = require("../constants/modelNames.constant");
const { PICTURE } = require("../constants/folderNames.constants");
const { API_URL } = require("../../config");

const announcementSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        minlength: 3,
        require: true,
        trim: true
    },
    category: {
        type: String,
        require: true,
        minlength: 3,
    },
    description: {
        type: String,
        maxlength: 500
    },
    startTime: {
        type: Date,
        require: true,
    },
    endTime: {
        type: Date,
        require: true,
    },
    status: {
        type: Boolean,
        require: true,
        default: true
    },
    private: {
        type: Boolean,
        require: true,
        default: true
    },
    tags: [{
        type: String
    }],
    picture: {
        type: String
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        require: true
    }
});

announcementSchema.virtual('pictureUrl')
  .get(
    function() { 
      return `${API_URL}/images/${PICTURE}/${this.picture}` 
    }
);

announcementSchema.virtual("announcementCompanyRef", {
    ref: "Company",
    localField: "companyId",
    foreignField: "_id"
});

const Announcement = mongoose.model(ANNOUNCEMENT, announcementSchema);

module.exports = Announcement;