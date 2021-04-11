import React from 'react';
import {GameBoardField} from "./GameBoardField";
import {Unit} from "./Unit";
import {UnitType, Team, GameState, Direction} from "../constants/Constants";
import {isAdjacent} from "../utils/Utils";


export class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initNewGame();
        this.handleClick = this.handleClick.bind(this);
    }

    generateTeam(team) {
        const allowedFigures = [UnitType.ROCK, UnitType.PAPER, UnitType.SCISSORS];

        const fields = [];
        for (let y = 0; y < 2; y++) {
            const row = [];
            for (let x = 0; x < 7; x++) {
                row.push(<Unit
                    team={team}
                    type={allowedFigures[Math.floor(Math.random() * 3)]}
                />);
            }
            fields.push(row);
        }
        return fields;
    }

    generateBoard() {
        const fields = [];
        this.generateTeam(Team.RED).forEach(row => fields.push(row));
        fields.push([null, null, null, null, null, null, null]);
        fields.push([null, null, null, null, null, null, null]);
        this.generateTeam(Team.BLUE).forEach(row => fields.push(row));

        return fields;
    }

    initNewGame() {
        return {
            board: this.generateBoard(),
            activeTeam: Team.RED,
            gameState: GameState.SELECT_UNIT,
            selectedField: null
        }
    }

    isAdjacentToSelectedField(otherField) {
        const selectedField = this.state.selectedField;

        return selectedField != null && isAdjacent(selectedField, otherField) != null;
    }

    moveUnit(from, to) {
        const unit = this.state.board[from.y][from.x];

        this.state.board[from.y][from.x] = null;
        this.state.board[to.y][to.x] = unit;
    }

    handleClick({x, y}) {
        const unit = this.state.board[y][x];

        // clicking on own unit
        if(unit !== null && unit.props.team === this.state.activeTeam) {
            switch (this.state.gameState) {
                case "SELECT_UNIT":
                case "MOVE_UNIT":
                    this.setState({
                        selectedField: {x, y},
                        gameState: GameState.MOVE_UNIT
                    })
            }

            return;
        }
        // clicking on neigbouring field
        if (this.isAdjacentToSelectedField({x, y})) {
            this.moveUnit(this.state.selectedField, {x, y});
        }

        // clicking on invalid field
        this.setState({
            selectedField: null,
            gameState: GameState.SELECT_UNIT
        })
    }

    render() {
        const fields = [];
        for (let y = 0; y < 6; y++) {
            const row = [];
            for (let x = 0; x < 7; x++) {
                const color = (x + y) % 2 === 0 ? "green" : "white";
                row.push(<GameBoardField
                    state={this.state}
                    key={`field_${x}_${y}`}
                    x={x}
                    y={y}
                    color={color}
                    onClick={this.handleClick}
                />);
            }

            fields.push(<div key={`row_${y}`} className="gameboard_row">{row}</div>);
        }

        return (
            <div>
                GameBoard
                <div className="gameboard">
                    {fields}
                </div>
            </div>
        )
    }
}

GameBoard.defaultProps = {}
