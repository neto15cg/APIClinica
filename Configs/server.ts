import * as http from "http";
import * as morgan from "morgan";
import * as cors from "cors";
import * as express from "express";
import * as bodyParser from "body-parser";

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

export const routes = express.Router();
app.use("/", routes);

export const httpServer = http.createServer(app);
httpServer.listen(3000, function() {
	console.log("Servidor rodando em localhost:3000");
});
