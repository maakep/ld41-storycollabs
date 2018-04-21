import * as express from "express";
import * as http from "http";
import * as path from "path";
import Game from "./game";

const port = 3000;

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../index.html"));
});

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../" + req.url));
});

server.listen(port, () => {
    console.log("listening on *:" + port);
});

new Game(server);