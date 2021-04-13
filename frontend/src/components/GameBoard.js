import React from 'react';
import {GameBoardField} from "./GameBoardField";
import {GameState, Team, UnitType} from "../constants/Constants";
import {isAdjacent} from "../utils/Utils";
import {UnitModel} from "../model/UnitModel";
import axios from "axios";
import {AppConfig} from "../config";


export class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestingPlayer: Team.RED
        };
        this.handleFieldClick = this.handleFieldClick.bind(this);
        this.handleToggleVisibleTeamClick = this.handleToggleVisibleTeamClick.bind(this);
    }

    componentDidMount() {
        axios({
            url: AppConfig.backendUrl + `/game/${this.props.gameId}`,
            params: {
                requestingPlayer: this.state.requestingPlayer.api
            }
        }).then(response => {

            this.setState({
                board: this.generateBoard(response.data.units),
                activeTeam: Team[response.data.activeTeam],
                gameState: GameState[response.data.gameState],
                selectedField: null
            });
        })
    }

    generateBoard(units) {
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
                requestingPlayer: this.state.activeTeam === Team.RED ? 'BLUE' : 'RED'
            }
        }).then(response => {
            this.setState({
                board: this.generateBoard(response.data.units),
                activeTeam: Team[response.data.activeTeam],
                gameState: GameState[response.data.gameState],
                requestingPlayer: this.state.activeTeam === Team.RED ? Team.BLUE : Team.RED,
                selectedField: null
            });
        })
    }

    handleToggleVisibleTeamClick() {
        const requestingPlayer = this.state.requestingPlayer === Team.RED ? Team.BLUE : Team.RED;
        this.setState({requestingPlayer});
        axios({
            url: AppConfig.backendUrl + `/game/${this.props.gameId}`,
            params: {
                requestingPlayer: requestingPlayer.api
            }
        }).then(response => {

            this.setState({
                board: this.generateBoard(response.data.units),
                activeTeam: Team[response.data.activeTeam],
                gameState: GameState[response.data.gameState]
            });
        })
    }

    handleFieldClick({x, y}) {
        const unit = this.state.board[y][x];

        // clicking on own unit
        if (unit !== null && unit.team === this.state.activeTeam) {
            switch (this.state.gameState) {
                case "SELECT_UNIT":
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
                    onClick={this.handleFieldClick}
                />);
            }

            fields.push(<div key={`row_${y}`} className="gameboard_row">{row}</div>);
        }

        return (
            <div className="container">
                <div className="state">GameBoard |
                    Turn: <span className={this.state.activeTeam.color}>{this.state.activeTeam.name}</span> |
                    Visible Team: <button onClick={this.handleToggleVisibleTeamClick}
                                          className={this.state.requestingPlayer.color}>{this.state.requestingPlayer.name}</button> |
                </div>
                <div className="gameboard">
                    {fields}
                </div>
            </div>
        )
    }
}

GameBoard.defaultProps = {}
