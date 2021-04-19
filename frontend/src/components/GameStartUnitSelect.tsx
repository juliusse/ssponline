import React from "react";
import {GameStateModel} from "../model/GameStateModel";
import {GameSetupState} from "./Game";
import {GameState} from "../constants/Constants";

type Props = {
    gameState: GameStateModel;
    setUpUnits: GameSetupState;
    onResetClick: React.MouseEventHandler<HTMLButtonElement>;
    onAcceptClick: React.MouseEventHandler<HTMLButtonElement>;
}

type State = {}

export class GameStartUnitSelect extends React.Component<Props, State> {
    render() {
        const gameState = this.props.gameState;
        const setUpUnits = this.props.setUpUnits;
        const specialUnitsSet = setUpUnits.trap1 && setUpUnits.trap2 && setUpUnits.flag;

        if (gameState.gameState !== GameState.SETUP ||
            !gameState.acceptedUnits ||
            gameState.acceptedSpecialUnits ||
            !specialUnitsSet) {
            return <span className="gameStartOptions"/>;
        }

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
