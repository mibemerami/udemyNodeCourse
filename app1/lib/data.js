const fs = require("fs");
const path = require("path");

let lib = {};
lib.baseDir = path.join(__dirname, "/../.data/");
lib.create = function(dir, file, data, callback) {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, filedescriptor) => {
      if (!err && filedescriptor) {
        let jsonData = JSON.stringify(data);
        fs.writeFile(filedescriptor, jsonData, err => {
          if (!err) {
            fs.close(filedescriptor, err => {
              if (!err) {
                callback(false);
              } else {
                callback("Problems while closing the file.");
              }
            });
          } else {
            callback("Problems while writing to file.");
          }
        });
      } else {
        callback("Couldn't create the file. Maybe it already exists.");
        console.log(err);
      }
    }
  );
};

module.exports = lib;
