import React from "react";
import {Unit} from "./Unit";
import {UnitModel} from "../model/UnitModel";
import {UnitType} from "../constants/Constants";
import "./UnitSelector.css"
import {Team} from "../model/Team";

type Props = {
    onChooseUnit: Function;
    choice: UnitType | null;
    team: Team;
}

type State = {}

export class UnitSelector extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(unitType: UnitType) {
        this.props.onChooseUnit(unitType);
    }

    render() {
        return (
            <div className="unitSelector">
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
