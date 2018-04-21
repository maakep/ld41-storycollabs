import * as socketIo from "socket.io";
import * as http from "http";

import { ITextType } from "../game/text/text";

interface IPlayer {
    name: string,
    points: number,
}

export default class Game {
    io: SocketIO.Server;
    story: ITextType[] = [];
    previousWriter: string = "";
    leaderboard: IPlayer[] = [];

    constructor(server: http.Server) {
        this.io = socketIo(server);

        this.io.on("connection", (socket) => {
            console.log("Client joined: " + socket.handshake.address);
        
            socket.on("client:getstory", () => {
                socket.emit("server:updateStory", this.getStory());
            });
            
            socket.on('client:send', (story: ITextType) => {
                if (socket.handshake.address != this.previousWriter) {
                    this.setStory(story);
                    this.io.sockets.emit("server:updateStory", this.getStory());
                    this.previousWriter = socket.handshake.address;
                    socket.emit("server:clear");
                } else {
                    socket.emit("server:error", "You cannot write two times in a row.");
                }
            });
        
            socket.on("disconnect", () => {
                console.log("Client disconnected: " + socket.handshake.address);
            })
        });
    }

    getStory(): ITextType[] {
        return this.story;
    }

    setStory(text: ITextType) {
        this.story = [...this.story, text];
    }
}