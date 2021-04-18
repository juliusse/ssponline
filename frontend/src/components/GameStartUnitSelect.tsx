import React from "react";
import "./UnitSelector.css"

type Props = {
    onResetClick: React.MouseEventHandler<HTMLButtonElement>;
    onAcceptClick: React.MouseEventHandler<HTMLButtonElement>;
}

type State = {}

export class GameStartUnitSelect extends React.Component<Props, State> {
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
