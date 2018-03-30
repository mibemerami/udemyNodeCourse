const http = require("http");
const url = require("url");

let server = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/|\/$/g, "");
  response.end("Hello World!");
  console.log("Request received on path ", trimmedPath);
});

server.listen(3000, () => {
  console.log("The Server is listening on port 3000 now.");
});
