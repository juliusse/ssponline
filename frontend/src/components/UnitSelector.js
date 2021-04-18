import React from "react";
import {Unit} from "./Unit";
import {UnitModel} from "../model/UnitModel";
import {UnitType} from "../constants/Constants";
import "./unitSelector.css"

export class UnitSelector extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(unitType) {
        this.props.onChooseUnit(unitType);
    }

    render() {
        return (
            <div className="unitSelector">
                <Unit onClick={this.handleClick} model={new UnitModel({team: this.props.team, type: UnitType.ROCK})} />
                <Unit onClick={this.handleClick} model={new UnitModel({team: this.props.team, type: UnitType.PAPER})} />
                <Unit onClick={this.handleClick} model={new UnitModel({team: this.props.team, type: UnitType.SCISSORS})} />
            </div>
        );
    }
}
