import React from 'react';
import {isAdjacent, pointEqual} from "../utils/Utils";
import {Unit} from "./Unit";
import {GameState, UnitType} from "../constants/Constants";

export class GameBoardField extends React.Component {
    constructor(props) {
        super(props);
        this.location = {x: props.x, y: props.y};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onClick({x: this.props.x, y: this.props.y});
    }

    getUnit() {
        return this.props.state.board[this.props.y][this.props.x];
    }

    isMyTeamsTurn() {
        const unit = this.getUnit();
        return unit != null && unit.team === this.props.state.activeTeam;
    }

    isFightLocation() {
        const fightLocation = this.props.state.fightLocation;
        if (fightLocation == null) {
            return;
        }

        return fightLocation.x === this.props.x && fightLocation.y === this.props.y;
    }

    classSelected() {
        const selectedField = this.props.state.selectedField;
        return selectedField != null && selectedField.x === this.props.x && selectedField.y === this.props.y ?
            'selected' : '';
    }

    render() {
        const unit = this.getUnit();
        let content = <Unit model={unit}/>;

        if (this.props.state.gameState === GameState.SETUP) {
            if (pointEqual(this.location, this.props.setUpUnits.trap1) ||
                pointEqual(this.location, this.props.setUpUnits.trap2)) {
                content = <img alt={UnitType.TRAP.name} src={UnitType.TRAP.src(this.props.state.playerTeam.imgColor)}/>
            }
            if (pointEqual(this.location, this.props.setUpUnits.flag)) {
                content = <img alt={UnitType.TRAP.name} src={UnitType.FLAG.src(this.props.state.playerTeam.imgColor)}/>
            }
        }

        if (this.isFightLocation()) {
            content = <img alt={UnitType.FIGHT.name} src={UnitType.FIGHT.src()}/>
        }

        if (!this.isMyTeamsTurn() && this.props.selectedField != null) {
            const selectedField = this.props.selectedField;
            const direction = isAdjacent(selectedField, this.props);
            if (direction != null) {
                content = <img alt="direction" src={direction.src}/>
            }
        }

        return (
            <div className={`gameboard_field ${this.props.color} ${this.classSelected()}`} onClick={this.handleClick}>
                {content}
            </div>
        )
    }
}
