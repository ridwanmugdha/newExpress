import http, { IncomingMessage, Server, ServerResponse } from "http";
import config from "./config/index";
import addRoutes from "./helpers/RouteHandler";
import { RouteHandler, routes } from "./helpers/RouteHandler";

addRoutes("GET", "/", (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Health Status OK", path: req.url }));
});

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    console.log(`Request received: ${req.url}`);

    // if (req.url === "/" && req.method === "GET") {
    //   res.writeHead(200, { "Content-Type": "application/json" });
    //   res.end(JSON.stringify({ message: "Health Status OK", path: req.url }));
    // } else

    const method = req.method?.toUpperCase() || "";
    const path = req.url || "";

    const methodMap = routes.get(method);
    const handler: RouteHandler | undefined = methodMap?.get(path);

    if (handler) {
      handler(req, res);
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "Route Not Found",
          path: req.url,
        })
      );
    }

    if (req.url === "/api" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "HI there delailah", path: req.url }));
    } else if (req.url === "/api/users" && req.method === "POST") {
      // const users = {
      //   id: 1,
      //   name: "John Doe",
      // };
      // res.writeHead(200, { "Content-Type": "application/json" });
      // res.end(JSON.stringify(users));
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        try {
          const parsedBody = JSON.parse(body);
          console.log("Received body:", parsedBody);
          console.log("Catching current changes");
          res.end(JSON.stringify(parsedBody));
        } catch (error: any) {
          console.log(error?.message);
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found\n");
    }
  }
);

server.listen(config.port, () => {
  console.log(`Server is listening on port ${process.env.PORT || 5000}`);
});
