import React from 'react';
import {GameBoardField} from "./GameBoardField";
import {GameState, Team, UnitType} from "../constants/Constants";
import {isAdjacent} from "../utils/Utils";
import {UnitModel} from "../model/UnitModel";
import axios from "axios";
import {AppConfig} from "../config";
import {UnitSelector} from "./UnitSelector";


export class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.team = Team[props.team];
        this.state = {};
        this.handleFieldClick = this.handleFieldClick.bind(this);
        this.handleFightUnitChosen = this.handleFightUnitChosen.bind(this);
    }

    componentDidMount() {
        this.reloadBoard();
    }

    isMyTurn() {
        return this.state.requestingPlayer === this.state.activeTeam;
    }

    startCheck() {
        if (this.intervallId == null) {
            this.intervallId = setInterval(() => {
                this.reloadBoard();
            }, 2000);
        }
    }

    stopCheck() {
        clearInterval(this.intervallId);
        this.intervallId = null;
    }

    handleBoardResponse(response) {
        const activeTeam = Team[response.data.activeTeam];
        this.setState({
            board: this.generateBoard(response.data.units, response.data.fight),
            activeTeam,
            gameState: GameState[response.data.gameState],
            fightLocation: response.data.fight ? response.data.fight.location : null,
            fightChoice: response.data.fight ? UnitType[response.data.fight.choice] : null,
            selectedField: null
        });

        if (activeTeam !== this.team) {
            this.startCheck();
        } else {
            this.stopCheck();
        }
    }

    reloadBoard() {
        axios({
            url: AppConfig.backendUrl + `/game/${this.props.gameId}`,
            params: {
                requestingPlayer: this.team.api
            }
        }).then(this.handleBoardResponse.bind(this))
    }

    generateBoard(units, fight) {
        const fields = [];
        fields.push([null, null, null, null, null, null, null]);
        fields.push([null, null, null, null, null, null, null]);
        fields.push([null, null, null, null, null, null, null]);
        fields.push([null, null, null, null, null, null, null]);
        fields.push([null, null, null, null, null, null, null]);
        fields.push([null, null, null, null, null, null, null]);

        units.forEach(unit => {
            const team = Team[unit.team];
            const type = UnitType[unit.type];
            const visible = UnitType[unit.visible];
            const model = new UnitModel({team, type, visible})
            fields[unit.location.y][unit.location.x] = model;
        })

        if (fight) {
            fields[fight.location.y][fight.location.x] = new UnitModel({type: UnitType.FIGHT})
        }

        return fields;
    }

    isAdjacentToSelectedField(otherField) {
        const selectedField = this.state.selectedField;

        return selectedField != null && isAdjacent(selectedField, otherField) != null;
    }

    moveUnit(from, to) {
        axios({
            method: 'post',
            url: AppConfig.backendUrl + `/game/${this.props.gameId}/move`,
            data: {from, to},
            params: {
                requestingPlayer: this.team.api
            }
        }).then(this.handleBoardResponse.bind(this))
    }

    handleFieldClick({x, y}) {
        const unit = this.state.board[y][x];

        // clicking on own unit
        if (unit !== null && unit.team === this.team && this.team === this.state.activeTeam) {
            switch (this.state.gameState) {
                case "TURN":
                case "MOVE_UNIT":
                    this.setState({
                        selectedField: {x, y},
                        gameState: GameState.MOVE_UNIT
                    })
                    break;
                default:
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
            gameState: GameState.TURN
        })
    }

    handleFightUnitChosen(unitType) {
        axios({
            method: 'post',
            url: AppConfig.backendUrl + `/game/${this.props.gameId}/fight/chose`,
            data: {unit: unitType.name},
            params: {
                requestingPlayer: this.team.api
            }
        }).then(this.handleBoardResponse.bind(this))
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
                    onClick={this.handleFieldClick}
                />);
            }

            fields.push(<div key={`row_${y}`} className="gameboard_row">{row}</div>);
        }

        const unitSelector = this.state.gameState === GameState.FIGHT ?
            <UnitSelector team={this.team} onChooseUnit={this.handleFightUnitChosen} /> : null;
        return (
            <div className="container">
                <div className="state">GameBoard | Turn: <span
                    className={this.state.activeTeam.color}>{this.state.activeTeam.name}</span>
                </div>
                <div className="gameboard">
                    {fields}
                </div>
                {unitSelector}
            </div>
        )
    }
}

GameBoard.defaultProps = {}
