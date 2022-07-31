const multer = require('multer');
const uuid = require('uuid');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/images/${file.fieldname}`);
  },
  filename: function (req, file, cb) {
    req.generatedFileName = `${uuid.v4()}${file.originalname}`;
    cb(null, req.generatedFileName);
  }
});

const upload = multer({ 
  storage: storage, 
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimetype = fileTypes.test(file.mimetype);

    if(mimetype){
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

module.exports = upload;