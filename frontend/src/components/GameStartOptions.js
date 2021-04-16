import React from "react";
import "./UnitSelector.css"

export class GameStartOptions extends React.Component {
    render() {
        return (
            <span className="gameStartOoptions">
                <button onClick={this.props.onShuffleClick}>Shuffle Units</button>
                |
                <button onClick={this.props.onAcceptClick}>Accept Units</button>
            </span>
        );
    }
}
