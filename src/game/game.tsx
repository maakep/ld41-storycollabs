import * as React from "react"; 
import * as io from "socket.io-client";
import { Text, ITextType } from "./text/text";

const socket = io();

interface IStateType {
    story: ITextType[];
    errorMessage: string;
}

interface IPropType {
    name: string;
}

export default class Game extends React.Component<IPropType, IStateType> {
    inputRef: React.RefObject<HTMLInputElement>;
    inputDisabled: boolean = false;

    newMessageAudio: any;
    errorAudio: any;

    responsiveVoice: any;

    constructor(props: IPropType) {
        super(props);

        this.state = {
            story: [],
            errorMessage: '',
        };

        this.inputRef = React.createRef();

        let writingCooldown: any;
        socket.on("server:updateStory", (newStory: ITextType[]) => {
            this.newMessageAudio.play();
            this.setState({ story: newStory });

            clearTimeout(writingCooldown);
            this.inputDisabled = true
            writingCooldown = setTimeout(() => {
                this.inputDisabled = false;
            }, 3000);
        });

        socket.on("server:clear", () => {
            this.inputRef.current.value = "";
        });

        socket.on("server:error", (message: string) => {
            this.displayError(message);
        });
        
        this.newMessageAudio = new Audio("../../assets/audio/NewMessage.mp3");
        this.errorAudio = new Audio("../../assets/audio/Error.mp3");
        this.newMessageAudio.volume = 0.2;

        socket.emit("client:getstory");
    }

    send(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.keyCode === 13 && !this.inputDisabled) {
            let story: ITextType = {name: this.props.name, story: e.currentTarget.value};
            socket.emit("client:send", story);
        } else if (e.keyCode === 13 && this.inputDisabled) {
            this.displayError("Someone just added to the story, make sure you read it before adding your addition.");
        }
    }

    errorTimeout: any;    
    displayError(message: string) {
        this.errorAudio.play();
        clearTimeout(this.errorTimeout);
        this.setState({ errorMessage: message });
        this.errorTimeout = setTimeout(() => {
            this.setState({errorMessage : ''});
        }, 4000);
    }

    render() {
        return (
            <div className={ "container" }>
                <div className={ "story" } >                
                    <h1>Story header</h1>
                    { 
                        this.state.story.map((value, index) => {
                            return <Text name={value.name} 
                                         story={value.story} 
                                         key={index}
                                    />
                        })
                    }
                </div>
                <div className={"error-message"}>
                    { this.state.errorMessage }
                </div>
                <input  placeholder = { "Submit your addition to the story..." } 
                        className = { "story-input" }
                        onKeyDown = { (e: React.KeyboardEvent<HTMLInputElement>) => this.send(e) } 
                        ref = { this.inputRef }
                    />
            </div>
        );
    }
}