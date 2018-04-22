const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

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
lib.read = function(dir, file, callback) {
  fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf8", (err, data) => {
    if (!err) {
      let parsedData = helpers.parseJsonToObject(data);
      callback(err, parsedData);
    } else {
      callback(err, data);
    }
  });
};
lib.update = function(dir, file, data, callback) {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    (err, filedescriptor) => {
      let jsonData = JSON.stringify(data);
      fs.truncate(filedescriptor, err => {
        if (!err) {
          fs.writeFile(filedescriptor, jsonData, err => {
            if (!err) {
              fs.close(filedescriptor, err => {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error while closing the file.");
                }
              });
            } else {
              callback("Error while writing data to file.");
            }
          });
        } else {
          callback("Error while truncating file");
        }
      });
    }
  );
};
lib.delete = function(dir, file, callback) {
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", err => {
    if (!err) {
      callback(false);
    } else {
      callback("Error while deleting the file.");
    }
  });
};

module.exports = lib;
