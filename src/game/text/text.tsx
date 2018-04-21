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

    render() {
        return (
            <span data-user={ this.props.name }>{ this.state.storyText }</span>
        );
    }
}