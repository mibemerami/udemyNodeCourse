const http = require("http");
const url = require("url");

let server = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const method = request.method.toLowerCase();
  const headers = request.headers;
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/|\/$/g, "");
  const queryStringObject = parsedUrl.query;

  response.end("Hello World!");

  console.log("Request received as method", method);
  console.log("Request received with headers", headers);
  console.log("Request received on path ", trimmedPath);
  console.log("Request received with query-string", queryStringObject);
});

server.listen(3000, () => {
  console.log("The Server is listening on port 3000 now.");
});
