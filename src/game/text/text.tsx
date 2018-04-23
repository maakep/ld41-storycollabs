import * as React from "react";

export interface ITextType {
    name: string;
    story: string;
    id?: string;
    active?: boolean;
    activate?: (id: string) => void;
}

interface IStateType {
    storyText: string;
    hover: boolean;
}

export class Text extends React.Component<ITextType, IStateType>{
    constructor(props: ITextType) {
        super(props);
        
        let storyText = this.props.story;
        if (!storyText.endsWith(" ")) {
            storyText += " ";
        }

        this.state = {
            storyText: storyText,
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
            rv.speak(this.state.storyText, this.voice, {pitch: 0.2+Math.random()*1.5, rate: 0.2+Math.random()*1.5});       
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

    }

    downvote() {

    }

    render() {
        return (
            <span>         
                <span   className={ ((this.props.active || this.state.hover) && "active") + " story-sentence" }
                        onClick = { this.onClick.bind(this) }  
                        onMouseEnter = { this.onEnter.bind(this) }
                        onMouseLeave = { this.onLeave.bind(this) }
                        data-user = { this.props.name }
                        data-id = { this.props.id }>
                    { this.state.storyText }
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