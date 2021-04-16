import React from 'react';
import {GameBoardField} from "./GameBoardField";
import {GameState, Team} from "../constants/Constants";
import {isAdjacent} from "../utils/Utils";
import axios from "axios";
import {AppConfig} from "../config";
import {UnitSelector} from "./UnitSelector";
import {GameStateModel} from "../model/GameStateModel";


export class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.team = Team[props.team];
        this.state = {
            gameState: new GameStateModel({playerTeam: Team[props.team]})
        };
        this.handleFieldClick = this.handleFieldClick.bind(this);
        this.handleFightUnitChosen = this.handleFightUnitChosen.bind(this);
    }

    componentDidMount() {
        this.loadActions();
    }

    componentWillUnmount() {
        this.stopCheck();
    }

    loadActions() {
        axios({
            url: AppConfig.backendUrl + `/game/${this.props.gameId}`,
            params: {
                requestingPlayer: this.team.api,
                fromIndex: this.state.gameState.lastProcessedAction + 1
            }
        }).then(this.processActions.bind(this))
    }

    processActions(response) {
        const gameState = this.state.gameState.processActions({actions: response.data.gameActions});
        this.setState({gameState});

        if ((gameState.gameState !== GameState.FIGHT && gameState.activeTeam !== this.team) ||
            (gameState.gameState === GameState.FIGHT && gameState.fightChoice != null)) {
            this.startCheck();
        } else {
            this.stopCheck();
        }
    }

    isMyTurn() {
        return this.team === this.state.gameState.activeTeam;
    }

    startCheck() {
        if (this.intervallId == null) {
            this.intervallId = setInterval(() => {
                this.loadActions();
            }, 2000);
        }
    }

    stopCheck() {
        clearInterval(this.intervallId);
        this.intervallId = null;
    }

    isAdjacentToSelectedField(otherField) {
        const selectedField = this.state.selectedField;

        return selectedField != null && isAdjacent(selectedField, otherField) != null;
    }

    moveUnit(from, to) {
        axios({
            method: 'post',
            url: AppConfig.backendUrl + `/game/${this.props.gameId}/action`,
            data: {actionType: 'MOVE', from, to},
            params: {
                requestingPlayer: this.team.api,
                fromIndex: this.state.gameState.lastProcessedAction + 1
            }
        }).then(this.processActions.bind(this))
    }

    handleFieldClick({x, y}) {
        const gameState = this.state.gameState;
        const unit = gameState.board[y][x];

        // clicking on own unit
        if (unit !== null &&
            unit.team === this.team &&
            this.team === gameState.activeTeam &&
            gameState.gameState === GameState.TURN) {

            this.setState({
                selectedField: {x, y},
            });
            return;
        }

        // clicking on neigbouring field
        if (this.isAdjacentToSelectedField({x, y})) {
            this.moveUnit(this.state.selectedField, {x, y});
        }

        // clicking on invalid field
        this.setState({
            selectedField: null
        })
    }

    handleFightUnitChosen(unitType) {
        axios({
            method: 'post',
            url: AppConfig.backendUrl + `/game/${this.props.gameId}/action`,
            data: {actionType: 'FIGHT_CHOOSE_UNIT', unitType: unitType.api},
            params: {
                requestingPlayer: this.team.api,
                fromIndex: this.state.gameState.lastProcessedAction + 1
            }
        }).then(this.processActions.bind(this))
    }

    render() {
        const gameState = this.state.gameState;
        if (gameState.board == null) {
            return <div></div>;
        }
        const fields = [];
        for (let y = 0; y < 6; y++) {
            const row = [];
            for (let x = 0; x < 7; x++) {
                const color = (x + y) % 2 === 0 ? "green" : "white";
                row.push(<GameBoardField
                    state={gameState}
                    selectedField={this.state.selectedField}
                    key={`field_${x}_${y}`}
                    x={x}
                    y={y}
                    color={color}
                    onClick={this.handleFieldClick}
                />);
            }

            fields.push(<div key={`row_${y}`} className="gameboard_row">{row}</div>);
        }

        const unitSelector = gameState.gameState === GameState.FIGHT ?
            <UnitSelector team={this.team}
                          choice={gameState.fightChoice}
                          onChooseUnit={this.handleFightUnitChosen}/> : null;

        const turnView = gameState.activeTeam != null ?
            <span className={gameState.activeTeam.color}>{gameState.activeTeam.name}</span> : null;
        return (
            <div className="container">
                <div className="state">GameBoard | Turn: {turnView}
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
