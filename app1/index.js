const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const https = require("https");
const fs = require("fs");
const handlers = require("./lib/handlers");
const helpers = require("./lib/helpers");

// Extract request data and call handlers to responde
let defineServerFunctionality = function(request, response) {
  // Extract data:
  const parsedUrl = url.parse(request.url, true);
  const method = request.method.toLowerCase();
  const headers = request.headers;
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/|\/$/g, "");
  const queryStringObject = parsedUrl.query;
  const stringDecoder = new StringDecoder("utf-8");
  let buffer = "";
  request.on("data", data => {
    buffer += stringDecoder.write(data);
  });
  request.on("end", () => {
    buffer += stringDecoder.end();

    // Responde:
    /// Select handler:
    let choosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;
    /// Create data object for the handler-function:
    let data = {
      method,
      headers,
      path: trimmedPath,
      queryStringObject,
      payload: helpers.parseJsonToObject(buffer)
    };
    /// Call handler:
    choosenHandler(data, function(statusCode, payload) {
      statusCode = typeof statusCode === "number" ? statusCode : 200;
      payload = typeof payload === "object" ? payload : {};
      let payloadString = JSON.stringify(payload);
      response.setHeader("Content-Type", "application/json");
      response.writeHead(statusCode);
      response.end(payloadString);
    });

    logOutStuff();
  });

  let logOutStuff = () => {
    console.log("-----------");
    console.log("Request received as method:", method);
    console.log("Request received with headers:", headers);
    console.log("Request received on path: ", trimmedPath);
    console.log("Request received with query-string:", queryStringObject);
    console.log("Request received with payload:", buffer);
  };
};

// Start server
// http:
let httpServer = http.createServer((request, response) => {
  defineServerFunctionality(request, response);
});
httpServer.listen(config.httpPort, () => {
  console.log(
    "The Server is listening on port " +
      config.httpPort +
      " now, in " +
      config.envName +
      "."
  );
});
//https:
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};
let httpsServer = https.createServer(
  httpsServerOptions,
  (request, response) => {
    defineServerFunctionality(request, response);
  }
);
httpsServer.listen(config.httpsPort, () => {
  console.log(
    "The Server is listening on port " +
      config.httpsPort +
      " now, in " +
      config.envName +
      "."
  );
});

// Define respopnses with handlers and a router
const router = {
  sample: handlers.sample,
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens
};
