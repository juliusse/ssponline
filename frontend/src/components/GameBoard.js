import React from 'react';
import {GameBoardField} from "./GameBoardField";
import {GameState, Team, UnitType} from "../constants/Constants";
import {isAdjacent} from "../utils/Utils";
import {UnitSelector} from "./UnitSelector";
import {GameStateModel} from "../model/GameStateModel";
import {GameBoardAdapter} from "../utils/GameBoardAdapter";
import {GameStartOptions} from "./GameStartOptions";
import {GameStartUnitSelect} from "./GameStartUnitSelect";


export class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.team = Team[props.team];
        this.gameBoardAdapter = new GameBoardAdapter({gameId: props.gameId, requestingTeam: this.team});
        this.state = {
            gameState: new GameStateModel({playerTeam: Team[props.team]}),
            selectedUnit: null,
            setUpUnits: {
                trap1: null,
                trap2: null,
                flag: null
            }
        };
        this.handleFieldClick = this.handleFieldClick.bind(this);
        this.handleFightUnitChosen = this.handleFightUnitChosen.bind(this);
        this.handleShuffleClick = this.handleShuffleClick.bind(this);
        this.handleAcceptClick = this.handleAcceptClick.bind(this);
        this.handleRestUnitsClick = this.handleRestUnitsClick.bind(this);
        this.handleAcceptSpecialUnitsClick = this.handleAcceptSpecialUnitsClick.bind(this);
    }

    componentDidMount() {
        this.loadActions();
    }

    componentWillUnmount() {
        this.stopCheck();
    }

    loadActions() {
        this.gameBoardAdapter
            .getActionsAsync({fromIndex: this.state.gameState.lastProcessedAction + 1})
            .then(this.processActions.bind(this));
    }

    moveUnit(from, to) {
        this.gameBoardAdapter
            .sendActionMoveUnit({from, to, fromIndex: this.state.gameState.lastProcessedAction + 1})
            .then(this.processActions.bind(this));
    }

    handleFightUnitChosen(unitType) {
        this.gameBoardAdapter
            .sendActionFightUnitChosen({unitType, fromIndex: this.state.gameState.lastProcessedAction + 1})
            .then(this.processActions.bind(this))
    }

    handleShuffleClick() {
        this.gameBoardAdapter
            .sendActionShuffleUnits({fromIndex: this.state.gameState.lastProcessedAction + 1})
            .then(this.processActions.bind(this));
    }

    handleAcceptClick() {
        this.gameBoardAdapter
            .sendActionAcceptUnits({fromIndex: this.state.gameState.lastProcessedAction + 1})
            .then(this.processActions.bind(this));
    }

    handleRestUnitsClick() {
        this.setState({
            setUpUnits: {
                trap1: null,
                trap2: null,
                flag: null
            }
        });
    }

    handleAcceptSpecialUnitsClick() {
        this.gameBoardAdapter
            .sendActionSelectSpecialUnits({
                trap1: this.state.setUpUnits.trap1,
                trap2: this.state.setUpUnits.trap2,
                flag: this.state.setUpUnits.flag,
                fromIndex: this.state.gameState.lastProcessedAction + 1
            })
            .then(this.processActions.bind(this));
    }

    processActions(response) {
        const gameState = this.state.gameState.processActions({actions: response.data.gameActions});
        this.setState({gameState});

        if ((gameState.gameState === GameState.SETUP && gameState.acceptedUnits) ||
            (gameState.gameState === GameState.TURN && gameState.activeTeam !== this.team) ||
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

    handleFieldClick(location) {
        const gameState = this.state.gameState;

        if (gameState.gameState === GameState.SETUP) {
            this.handleFieldClickStateSetup(location);
            return;
        }

        if (gameState.gameState === GameState.TURN) {
            this.handleFieldClickStateTurn(location);
            return;
        }
    }

    handleFieldClickStateSetup({x, y}) {
        const gameState = this.state.gameState;
        const setUpUnits = this.state.setUpUnits;
        const unit = gameState.board[y][x];

        if (!gameState.acceptedUnits || gameState.acceptedSpecialUnits) {
            return;
        }
        if (unit.team === this.team && unit.type !== UnitType.FLAG) {
            if (setUpUnits.trap1 == null) {
                setUpUnits.trap1 = {x, y};
            } else if (setUpUnits.trap2 == null) {
                setUpUnits.trap2 = {x, y};
            } else {
                setUpUnits.flag = {x, y};
            }
        }

        this.setState({setUpUnits});
    }

    handleFieldClickStateTurn({x, y}) {
        const gameState = this.state.gameState;
        const unit = gameState.board[y][x];

        if (unit !== null &&
            unit.type.isMovable &&
            unit.team === this.team &&
            this.team === gameState.activeTeam) {

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
                    setUpUnits={this.state.setUpUnits}
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

        const setupView = gameState.gameState === GameState.SETUP && !gameState.acceptedUnits ?
            <GameStartOptions onShuffleClick={this.handleShuffleClick} onAcceptClick={this.handleAcceptClick}/> : null;

        const setUpUnits = this.state.setUpUnits;
        const specialUnitsSet = setUpUnits.trap1 && setUpUnits.trap2 && setUpUnits.flag;
        const acceptUnitsView =
            gameState.acceptedUnits &&
            !gameState.acceptedSpecialUnits &&
            gameState.gameState === GameState.SETUP &&
            specialUnitsSet ?
                <GameStartUnitSelect onResetClick={this.handleRestUnitsClick}
                                     onAcceptClick={this.handleAcceptSpecialUnitsClick}/> :
                null;
        return (
            <div className="container">
                <div className="state">GameBoard | Turn: {turnView} | {setupView} {acceptUnitsView}
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
