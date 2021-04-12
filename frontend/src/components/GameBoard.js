import React from 'react';
import {GameBoardField} from "./GameBoardField";
import {Unit} from "./Unit";
import {UnitType, Team, GameState, Direction} from "../constants/Constants";
import {isAdjacent} from "../utils/Utils";
import {UnitModel} from "../model/UnitModel";


export class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.setState(this.initNewGame());
    }

    generateTeam(team) {
        const allowedFigures = [UnitType.ROCK, UnitType.PAPER, UnitType.SCISSORS];

        const fields = [];
        for (let y = 0; y < 2; y++) {
            const row = [];
            for (let x = 0; x < 7; x++) {
                const type = allowedFigures[Math.floor(Math.random() * 3)];

                row.push(new UnitModel({team, type, visible: false}))

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

    fight(attacker, defender) {
        if(defender == null) {
            return attacker;
        }

        return attacker.props.type.winsAgainst(defender.props.type) ? attacker : defender;
    }

    moveUnit(from, to) {
        const unitFrom = this.state.board[from.y][from.x];
        const unitTo = this.state.board[to.y][to.x];

        if (unitTo == null) {
            this.state.board[from.y][from.x] = null;
            this.state.board[to.y][to.x] = unitFrom;
            return;
        }

        const winningUnit = unitFrom.type.winsAgainst(unitTo.type) ? unitFrom : unitTo;
        winningUnit.visible = true;

        this.state.board[from.y][from.x] = null;
        this.state.board[to.y][to.x] = winningUnit;
    }

    toggleTeam() {
        const nextTeam = this.state.activeTeam == Team.RED ? Team.BLUE : Team.RED;
        this.setState({activeTeam: nextTeam});
    }

    handleClick({x, y}) {
        const unit = this.state.board[y][x];

        // clicking on own unit
        if(unit !== null && unit.team === this.state.activeTeam) {
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
            this.toggleTeam();
        }

        // clicking on invalid field
        this.setState({
            selectedField: null,
            gameState: GameState.SELECT_UNIT
        })
    }

    render() {
        if (this.state.board == null) {
            return <div></div>;
        }
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
            <div className="container">
                <div className="state">GameBoard | Turn: <span className={this.state.activeTeam.color}>{this.state.activeTeam.name}</span></div>
                <div className="gameboard">
                    {fields}
                </div>
            </div>
        )
    }
}

GameBoard.defaultProps = {}
