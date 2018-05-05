import * as React from "react";
import { Socket } from "socket.io-client";
export interface ITextType {
    author: string;
    story: string;
    rating: number;
    id?: string;
    active?: boolean;
    activate?: (id: string) => void;
    vote?: (vote: Vote) => void;
}

export type Vote = {
    messageId: string;
    upvote: boolean;
    socket?: string;
}


interface IPropType {
    active: boolean;
    activate: (id: string) => void;
    text: ITextType;
    socket: SocketIOClient.Socket;
}

interface IStateType {
    hover: boolean;
}

export class Text extends React.Component<ITextType, IStateType>{
    storyText: string;

    constructor(props: ITextType) {
        super(props);
        
        let storyText = this.props.story;
        if (!storyText.endsWith(" ")) {
            storyText += " ";
        }
        
        this.storyText = storyText;
        this.state = {
            hover: false,
        };
    }

    voice: string = "UK English Male";
    speakText() {
        let rv = (window as any).responsiveVoice;

        if (rv == undefined || !rv.voiceSupport()) {
            return;
        }

        if (!rv.isPlaying()) {
            // Only works if the text isn't too long
            rv.speak(this.storyText, this.voice, {pitch: 0.2+Math.random()*1.5, rate: 0.2+Math.random()*1.5});       
        }
        else {
            rv.cancel();
        }
    }

    onClick() {
        this.props.activate(this.props.id);
    }

    onEnter() {
        this.setState({ hover: true });
    }

    onLeave() {
        this.setState({ hover: false });
    }

    upvote() {
        this.props.vote({ messageId: this.props.id, upvote: true })
    }

    downvote() {
        this.props.vote({ messageId: this.props.id, upvote: false })
    }

    render() {
        if (this.props.rating < -1)
            return null;

        return (
            <span>         
                <span   className={ ((this.props.active || this.state.hover) && "active") + " story-sentence" }
                        onClick = { this.onClick.bind(this) }  
                        onMouseEnter = { this.onEnter.bind(this) }
                        onMouseLeave = { this.onLeave.bind(this) }
                        data-user = { this.props.author }
                        data-id = { this.props.id }>
                    { this.storyText }
                </span>
                {(this.state.hover || this.props.active) && (
                        <div className = { (this.state.hover ? "top-z " : "") + "text-context-menu" }>
                            <div>
                                <div className = { "context-name" }>
                                    { this.props.author }
                                </div>
                                <div className = { "voting" }>
                                    <div className = { "vote up" } onClick={ this.upvote.bind(this) } title={"Upvote selected text"}>
                                    ▲
                                    </div>
                                    <div> { this.props.rating } </div>
                                    <div className = { "vote down" } onClick={ this.downvote.bind(this) } title={"Downvote selected text (-2 to remove from story)"}>
                                    ▼
                                    </div>
                                </div>
                            </div>
                            <div className={ "speaker" } onClick={ this.speakText.bind(this) }></div>
                        </div>
                    )}
            </span>
        );
    }
}