import React from 'react';
import {GameState} from "../constants/Constants";
import {isAdjacent} from "../utils/Utils";
import {Unit} from "./Unit";

export class GameBoardField extends React.Component {
    constructor(props) {
        super(props);
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

    classSelected() {
        const selectedField = this.props.state.selectedField;
        return selectedField != null && selectedField.x === this.props.x && selectedField.y === this.props.y ?
            'selected' : '';
    }

    render() {
        const unit = this.getUnit();
        let content = <Unit
            model={unit}
            isMyTeamsTurn={this.isMyTeamsTurn()}
        />;
        if (!this.isMyTeamsTurn() && this.props.state.gameState === GameState.MOVE_UNIT) {
            const selectedField = this.props.state.selectedField;
            const direction = isAdjacent(selectedField, this.props);
            if(direction != null) {
                content = <img src={direction.src}/>
            }
        }

        return (
            <div className={`gameboard_field ${this.props.color} ${this.classSelected()}`} onClick={this.handleClick}>
                {content}
            </div>
        )
    }
}

GameBoardField.defaultProps = {
    state: null,
    x: null,
    y: null,
    color: null,
    onClick: null,
}