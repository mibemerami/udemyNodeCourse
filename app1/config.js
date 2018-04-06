const process = require("process");

const environments = {
  staging: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "staging"
  },

  production: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: "production"
  }
};

const argument =
  typeof process.env.ENV_DATA === "string"
    ? process.env.ENV_DATA.toLowerCase()
    : "";

const exportEnv =
  typeof environments[argument] === "object"
    ? environments[argument]
    : environments.staging;

module.exports = exportEnv;
