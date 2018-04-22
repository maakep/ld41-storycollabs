import * as React from "react"; 
import * as io from "socket.io-client";
import { Text, ITextType } from "./text/text";

const socket = io();

interface IStateType {
    story: ITextType[];
    errorMessage: string;
    readers: number;
    activeId: string;
}

interface IPropType {
    name: string;
    logout: () => void;
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
            readers: null,
            activeId: null,
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

        socket.on("server:readersUpdate", (readers: number) => {     
            this.setState({ readers });
        });
        
        this.newMessageAudio = new Audio("../../assets/audio/NewMessage.mp3");
        this.errorAudio = new Audio("../../assets/audio/Error.mp3");

        socket.emit("client:getdata");
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.clearActiveSentences.bind(this));
    }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.clearActiveSentences.bind(this));
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

    activateSentence(id: string) {
        this.setState({activeId: id});
    }

    clearActiveSentences(e: any) {
        if (e.which !== 1)
            return;

        let clickedDataId = e.target.attributes["data-id"];
        let hitAllowedClicks = (e.target.className === "text-context-menu" 
                                    || e.target.className === "voting"
                                    || e.target.className === "vote up"
                                    || e.target.className === "vote down"
                                    || e.target.className === "context-name");
        console.log(e.target.className);
        if (clickedDataId === undefined && !hitAllowedClicks) {
            this.setState({activeId: null});
        }
    }

    render() {
        return (
            <div className={ "container" }>
            <div onClick={() => this.props.logout() } className={ "log-out" } title={"Log out"}></div>
            <div className={ "readers font" } title={this.state.readers + " authors currently looking"}> { this.state.readers } </div>
                <div className={ "story" }>        
                    <h1>Collaborate to make a story...</h1>
                    { 
                        this.state.story.map((value, index) => {
                            return <Text 
                                        active = {(this.state.activeId === value.id)}
                                        id = {value.id}
                                        activate = {this.activateSentence.bind(this)}
                                        name = {value.name} 
                                        story = {value.story} 
                                        key = {value.id}
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