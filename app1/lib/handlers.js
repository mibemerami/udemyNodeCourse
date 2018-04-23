const _data = require("./data");
const helpers = require("./helpers");

let handlers = {};
handlers.sample = function(data, callback) {
  callback(406, { name: "Sample handler" });
};

handlers.ping = function(data, callback) {
  callback(200);
};
handlers.notFound = function(data, callback) {
  callback(404);
};

// Users:
handlers.users = function(data, callback) {
  let validMethods = ["get", "put", "post", "delete"];
  if (validMethods.includes(data.method)) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._users = {};

handlers._users.get = function(data, callback) {
  let phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.length > 0
      ? data.queryStringObject.phone
      : false;
  if (phone) {
    _data.read("users", phone, (err, data) => {
      if (!err) {
        delete data.hashedPassword;
        callback(200, data);
      } else {
        callback(404);
      }
    });
  }
};
handlers._users.put = function(data, callback) {};
handlers._users.post = function(data, callback) {
  // Check that all required fields are filled out
  let firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  let lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  let phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length > 0
      ? data.payload.phone.trim()
      : false;
  let password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  let tosAgreement =
    typeof data.payload.tosAgreement === "boolean"
      ? data.payload.tosAgreement
      : false;
  if (firstName && lastName && phone && password && tosAgreement) {
    // Make sure the user doesnt already exist
    _data.read("users", phone, (err, data) => {
      if (err) {
        // create user
        let hashedPassword = helpers.hash(password);
        if (hashedPassword) {
          let userObjekt = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement
          };
          _data.create("users", phone, userObjekt, function(err) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { Error: "Could not create the new user" });
            }
          });
        } else {
          callback(500, { Error: "Could not hash the user's password" });
        }
      } else {
        // User alread exists
        callback(400, {
          Error: "A user with that phone number already exists"
        });
      }
    });
  } else {
    callback(500, {
      Error: "Missing required fields."
    });
  }
};
handlers._users.delete = function(data, callback) {};

module.exports = handlers;
