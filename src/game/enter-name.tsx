import * as React from "react";
import Game from "./game";

interface IStateType {
    name: string;
}

export class EnterName extends React.Component<null, IStateType> {
    constructor(props: null) {
        super(props);
        const storedName = localStorage.getItem("ld41-name");
        this.state = {
            name: storedName,
        };
    }
    public setName(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.keyCode === 13) {
            const newName = e.currentTarget.value;
            if (newName.length > 3) {
                localStorage.setItem("ld41-name", newName);
                this.setState({name: newName});
            } else {
                e.currentTarget.value += 1337;
            }
        }
    }

    public render() {
        return (
            (this.state.name != null)
                ? <Game name={this.state.name} />
                : <input 
                        className={"enter-name"}
                        placeholder={"Click Enter to submit your username"} 
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => this.setName(e)} 
                    />
        );
    }
}
