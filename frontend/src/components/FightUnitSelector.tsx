import React from "react";
import {Unit} from "./Unit";
import {UnitModel} from "../model/UnitModel";
import {GameState, UnitType} from "../constants/Constants";
import "./FightUnitSelector.css"
import {Team} from "../model/Team";

type Props = {
    gameState: GameState | null;
    onChooseUnit: Function;
    choice: UnitType | null;
    team: Team;
}

type State = {}

export class FightUnitSelector extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(unitType: UnitType) {
        this.props.onChooseUnit(unitType);
    }

    render() {
        if (this.props.gameState !== GameState.FIGHT) {
            return <div className="FightUnitSelector" />;
        }

        return (
            <div className="FightUnitSelector">
                <Unit isActive={this.props.choice === UnitType.ROCK}
                      onClick={this.handleClick}
                      model={new UnitModel(this.props.team, UnitType.ROCK, false)}/>
                <Unit isActive={this.props.choice === UnitType.PAPER}
                      onClick={this.handleClick}
                      model={new UnitModel(this.props.team, UnitType.PAPER, false)}/>
                <Unit isActive={this.props.choice === UnitType.SCISSORS}
                      onClick={this.handleClick}
                      model={new UnitModel(this.props.team, UnitType.SCISSORS, false)}/>
            </div>
        );
    }
}
