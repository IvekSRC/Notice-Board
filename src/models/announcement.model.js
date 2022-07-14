const mongoose = require("mongoose");
const { ANNOUNCEMENT } = require("../constants/modelNames.constant");

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
        required: true,
    },
    endTime: {
        type: Date,
    },
    status: {
        type: Boolean,
        require: true
    },
    picture: {
        type: String
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        require: true
    }
});

announcementSchema.virtual("announcementCompanyRef", {
    ref: "Company",
    localField: "companyId",
    foreignField: "_id"
});

const Announcement = mongoose.model(ANNOUNCEMENT, announcementSchema);

module.exports = Announcement;