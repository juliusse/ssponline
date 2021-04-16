import React from "react";
import "./UnitSelector.css"

export class GameStartUnitSelect extends React.Component {
    render() {
        return (
            <span className="gameStartOptions">
                |
                <button onClick={this.props.onResetClick}>Reset Units</button>
                |
                <button onClick={this.props.onAcceptClick}>Accept Units</button>
            </span>
        );
    }
}
