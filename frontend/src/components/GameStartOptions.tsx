import React from "react";
import "./UnitSelector.css"

type Props = {
    onShuffleClick: React.MouseEventHandler<HTMLButtonElement>;
    onAcceptClick: React.MouseEventHandler<HTMLButtonElement>;
}

type State = {}

export class GameStartOptions extends React.Component<Props, State> {
    render() {
        return (
            <span className="gameStartOptions">
                |
                <button onClick={this.props.onShuffleClick}>Shuffle Units</button>
                |
                <button onClick={this.props.onAcceptClick}>Accept Units</button>
            </span>
        );
    }
}
