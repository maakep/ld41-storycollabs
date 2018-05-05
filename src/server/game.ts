import * as socketIo from "socket.io";
import * as http from "http";

import { ITextType, Vote } from "../game/text/text";

interface IPlayer {
    name: string,
    points: number,
}
type PlayerVote = {
    name: string,
    messageId: string,
    upvote: boolean,
}

export default class Game {
    io: SocketIO.Server;
    story: ITextType[] = [];
    previousWriter: string = "";
    leaderboard: IPlayer[] = [];
    votes: PlayerVote[] = [];

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

            socket.on("client:vote", (vote: Vote) => {
                // Performance?
                let voteAmount = vote.upvote ? 1 : -1;
                let alreadyVoted = this.votes.find(x => x.name === socket.handshake.address 
                                                    && x.messageId === vote.messageId 
                                                    && x.upvote === vote.upvote) !== undefined;
                if (alreadyVoted) {
                    socket.emit("server:error", "You've already performed this vote.");
                    return;
                }

                let oppositeVote = this.votes.find(x => x.name === socket.handshake.address 
                                                    && x.messageId === vote.messageId 
                                                    && x.upvote === !vote.upvote);
                console.log(oppositeVote);

                if (oppositeVote !== undefined) {
                    this.votes.splice(this.votes.indexOf(oppositeVote), 1);
                    voteAmount *= 2;
                }

                this.story.find(x => x.id === vote.messageId).rating += voteAmount;
                this.votes.push({name: socket.handshake.address, messageId: vote.messageId, upvote: vote.upvote});
                this.io.sockets.emit("server:updateStory", this.getStory());
            });
        
            socket.on("disconnect", () => {
                console.log("Client disconnected: " + socket.handshake.address);
                this.readers--;
                this.io.sockets.emit("server:readersUpdate", this.readers);
            });

            this.readers++;
        });
    }

    getStory(): ITextType[] {
        return this.story;
    }

    setStory(text: ITextType) {
        text.id = text.author + new Date().getTime();
        console.log(text.id);
        this.story = [...this.story, text];
    }
}
