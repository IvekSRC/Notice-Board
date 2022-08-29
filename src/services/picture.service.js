const fs = require('fs');

const deleteFile = async (folderName, fileName) => {
    fs.unlink(
      `public/images/${folderName}/${fileName}`,
      async function(err) {
        if(err) {
          throw new Error(err.message);
        }
      }
    )
}

module.exports = {
  deleteFile
}