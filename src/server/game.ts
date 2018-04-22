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

    readers: number = 0;

    constructor(server: http.Server) {
        this.io = socketIo(server);

        this.io.on("connection", (socket) => {
            console.log("Client joined: " + socket.handshake.address);
            
        
            socket.on("client:getdata", () => {
                socket.emit("server:updateStory", this.getStory());
                this.io.sockets.emit("server:readersUpdate", this.readers);
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
                this.readers--;
                this.io.sockets.emit("server:readersUpdate", this.readers);
            })
            this.readers++;
        });
    }

    getStory(): ITextType[] {
        return this.story;
    }

    setStory(text: ITextType) {
        text.id = text.name + new Date().getTime();
        console.log(text.id);
        this.story = [...this.story, text];
    }
}