import * as React from "react";

export interface ITextType {
    name: string;
    story: string;
}

interface IStateType {
    storyText: string;
    active: boolean;
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
            active: false,
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
        this.speakText();
    }

    onEnter() {
        this.setState({ active: true });
    }

    onLeave() {
        this.setState({ active: false });
    }

    upvote() {

    }

    downvote() {

    }

    render() {
        return (              
                <span   className={ (this.state.active && "active ") + " story-sentence" }
                        onClick = { this.onClick.bind(this) } 
                        data-user = { this.props.name } 
                        onMouseEnter = { this.onEnter.bind(this) }
                        onMouseLeave = { this.onLeave.bind(this) }
                        >
                    { this.state.storyText }
                </span>
                /*{ this.state.showVoting && (
                    <div className={ "voting" }>
                        <div className={ "vote up" } onClick = { this.upvote.bind(this) }>
                        +
                        </div>
                        <div className={ "vote down" }>
                        -
                        </div>
                    </div>
                )}*/
        );
    }
}