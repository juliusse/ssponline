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
        this.actions = [];
        this.lastProcessedAction = -1;
        this.state = {};
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
                fromIndex: this.lastProcessedAction
            }
        }).then(this.processActions.bind(this))
    }

    processActions(response) {
        response.data.gameActions.map(action => {
            if (action.actionId > this.lastProcessedAction) {
                this.processAction(action);
            }
        });
    }

    processAction(action) {
        if (action.actionType === 'CONFIGURE') {
            this.processActionConfigure(action);
        } else if (action.actionType === 'SHUFFLE_UNITS') {
            this.processActionShuffleUnits(action);
        } else if (action.actionType === 'ACCEPT_UNITS') {
            this.processActionAcceptTurn(action);
        } else if (action.actionType === 'START') {
            this.processActionGameStart(action);
        } else if (action.actionType === 'MOVE') {
            this.processActionMove(action);
        }

        this.setState({
            activeTeam: Team[action.activeTeam],
            gameState: GameState[action.gameState]
        })
        this.lastProcessedAction = action.actionId;

        if ((this.state.gameState !== GameState.FIGHT && this.state.activeTeam !== this.team) ||
            (this.state.gameState === GameState.FIGHT && this.state.fightChoice != null)) {
            this.startCheck();
        } else {
            this.stopCheck();
        }
    }

    processActionConfigure(configureAction) {
        const board = [];
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);

        this.setState({board})
    }

    processActionShuffleUnits(shuffleUnitsAction) {
        const board = this.state.board;
        shuffleUnitsAction
            .units
            .map(unit => {
                const team = Team[unit.team];
                const type = UnitType[unit.type];
                const visible = UnitType[unit.visible];
                const model = new UnitModel({team, type, visible})
                board[unit.location.y][unit.location.x] = model;
            });

        this.setState({board})
    }

    processActionAcceptTurn(acceptTurnAction) {
        // todo
    }

    processActionGameStart(gameStartAction) {
        // todo
    }

    processActionMove(moveAction) {
        const board = this.state.board;
        const unit = board[moveAction.from.y][moveAction.from.x];

        board[moveAction.from.y][moveAction.from.x] = null;
        board[moveAction.to.y][moveAction.to.x] = unit;

        this.setState({board});
    }

    processActionFight(fightAction) {
        if (fight) {
            fields[fight.location.y][fight.location.x] = new UnitModel({type: UnitType.FIGHT})
        }
    }

    isMyTurn() {
        return this.state.requestingPlayer === this.state.activeTeam;
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


    }

    generateBoard(units, fight) {
        if (fight) {
            fields[fight.location.y][fight.location.x] = new UnitModel({type: UnitType.FIGHT})
        }
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
                requestingPlayer: this.team.api
            }
        }).then(this.processActions.bind(this))
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
            url: AppConfig.backendUrl + `/game/${this.props.gameId}/fight/choose`,
            data: {unitType: unitType.api},
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
            <UnitSelector team={this.team} onChooseUnit={this.handleFightUnitChosen}/> : null;
        const turnView = this.state.activeTeam != null ?
            <span className={this.state.activeTeam.color}>{this.state.activeTeam.name}</span> : null;
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
