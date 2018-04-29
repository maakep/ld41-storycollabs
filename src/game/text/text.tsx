import * as React from "react";
import { Socket } from "socket.io-client";
export interface ITextType {
    name: string;
    story: string;
    rating: number;
    id?: string;
    active?: boolean;
    activate?: (id: string) => void;
    vote?: (vote: Vote) => void;
}

export type Vote = {
    id: string;
    rating: boolean;
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
        this.props.vote({ id: this.props.id, rating: true })
    }

    downvote() {
        this.props.vote({ id: this.props.id, rating: false })
    }

    render() {
        if (this.props.rating < 0)
            return null;

        return (
            <span>         
                <span   className={ ((this.props.active || this.state.hover) && "active") + " story-sentence" }
                        onClick = { this.onClick.bind(this) }  
                        onMouseEnter = { this.onEnter.bind(this) }
                        onMouseLeave = { this.onLeave.bind(this) }
                        data-user = { this.props.name }
                        data-id = { this.props.id }>
                    { this.storyText }
                </span>
                {(this.state.hover || this.props.active) && (
                        <div className = { "text-context-menu" }>
                            <div>
                                <div className = { "context-name" }>
                                    { this.props.name }
                                </div>
                                {this.props.active && (
                                <div className = { "voting" }>
                                    <div className={ "speaker" } onClick={ this.speakText.bind(this) }></div>
                                    <div className = { "vote up" } onClick={ this.upvote.bind(this) }>
                                    +
                                    </div>
                                    <div className = { "vote down" } onClick={ this.downvote.bind(this) }>
                                    -
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    )}
            </span>
        );
    }
}