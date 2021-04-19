import React from "react";
import {GameState} from "../constants/Constants";
import {GameStateModel} from "../model/GameStateModel";

type Props = {
    gameState: GameStateModel;
    onShuffleClick: React.MouseEventHandler<HTMLButtonElement>;
    onAcceptClick: React.MouseEventHandler<HTMLButtonElement>;
}

type State = {}

export class GameStartOptions extends React.Component<Props, State> {
    render() {
        const gameState = this.props.gameState;

        if(gameState.gameState !== GameState.SETUP || gameState.acceptedUnits) {
            return <span className="gameStartOptions" />
        }

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
