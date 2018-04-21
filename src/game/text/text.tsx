import * as React from "react";

export interface ITextType {
    name: string,
    story: string,
}

interface IStateType {
    storyText: string;
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
            rv.speak(this.state.storyText, this.voice, {pitch: 1, rate: 1});       
        }
        else {
            rv.cancel();
        }
    }

    render() {
        return (
            <span onClick={ () => this.speakText() } data-user={ this.props.name }>{ this.state.storyText }</span>
        );
    }
}