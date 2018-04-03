const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

let server = http.createServer((request, response) => {
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
    response.end("Hello World!");
    logoutStuff();
  });

  let logoutStuff = () => {
    console.log("-----------");
    console.log("Request received as method:", method);
    console.log("Request received with headers:", headers);
    console.log("Request received on path: ", trimmedPath);
    console.log("Request received with query-string:", queryStringObject);
    console.log("Request received with payload:", buffer);
  };
});

server.listen(3000, () => {
  console.log("The Server is listening on port 3000 now.");
});
