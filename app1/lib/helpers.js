const crypto = require("crypto");
const config = require("../config");

let helpers = {};

helpers.hash = function(str) {
  if (typeof str === "string" && str.length > 0) {
    let hash = crypto
      .createHmac("sha256", config.hashingSecrets)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};
helpers.parseJsonToObject = function(jsonData) {
  try {
    return JSON.parse(jsonData);
  } catch (e) {
    console.log(e);
    return {};
  }
};
helpers.createRandomString = function(strLength) {
  let validChars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
  for (let i = 0; i < strLength; i++) {
    str += validChars.charAt(Math.floor(Math.random() * validChars.length));
  }
  return str;
};

module.exports = helpers;
