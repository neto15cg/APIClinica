import * as server from "./Configs/server";
const httpServer = server.httpServer;
const routes = server.routes;
const routeClinica = require("./Controllers/ClinicaController")(routes);
