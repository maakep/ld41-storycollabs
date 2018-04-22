import * as React from "react";

export interface ITextType {
    name: string;
    story: string;
}

interface IStateType {
    storyText: string;
    showVoting: boolean;
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
            showVoting: false,
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

    onEnter() {
        this.setState({ showVoting: true });
    }

    onLeave() {
        this.setState({ showVoting: false });
    }

    upvote() {

    }

    downvote() {

    }

    render() {
        return (              
                <span   className={ "story-sentence" }
                        onClick = { this.speakText.bind(this) } 
                        data-user = { this.props.name } >
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