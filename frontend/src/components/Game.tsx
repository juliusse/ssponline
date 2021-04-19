import React from 'react';
import {GameState, UnitType} from "../constants/Constants";
import {isAdjacent} from "../utils/Utils";
import {FightUnitSelector} from "./FightUnitSelector";
import {GameStateModel} from "../model/GameStateModel";
import {GameActionsListResponse, GameBoardAdapter} from "../utils/GameBoardAdapter";
import {GameStartOptions} from "./GameStartOptions";
import {GameStartUnitSelect} from "./GameStartUnitSelect";
import {Team} from "../model/Team";
import {Point} from "../model/Point";
import {AxiosResponse} from "axios";
import {GameBoard} from "./GameBoard";
import {GameLog} from "./GameLog";

type Props = {
    team: Team
    gameId: string
}

type State = {
    gameState: GameStateModel
    selectedField: Point | null
    setUpUnits: GameSetupState
}

export type GameSetupState = {
    trap1: Point | null
    trap2: Point | null
    flag: Point | null
}

export class Game extends React.Component<Props, State> {
    readonly team: Team;
    readonly gameBoardAdapter: GameBoardAdapter;

    private intervalId: number | null = null;

    constructor(props: Props) {
        super(props);
        this.team = props.team;
        this.gameBoardAdapter = new GameBoardAdapter(props.gameId, this.team);
        this.state = {
            gameState: new GameStateModel(this.team),
            selectedField: null,
            setUpUnits: {
                trap1: null,
                trap2: null,
                flag: null
            }
        };
        this.handleMoveUnit = this.handleMoveUnit.bind(this);
        this.handlePlaceSpecialUnit = this.handlePlaceSpecialUnit.bind(this);

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
            .getActionsAsync(this.state.gameState.lastProcessedAction + 1)
            .then(this.processActions.bind(this));
    }

    moveUnit(from: Point, to: Point) {
        this.gameBoardAdapter
            .sendActionMoveUnit(from, to, this.state.gameState.lastProcessedAction + 1)
            .then(this.processActions.bind(this));
    }

    handleFightUnitChosen(unitType: UnitType) {
        this.gameBoardAdapter
            .sendActionFightUnitChosen(unitType, this.state.gameState.lastProcessedAction + 1)
            .then(this.processActions.bind(this))
    }

    handleShuffleClick() {
        this.gameBoardAdapter
            .sendActionShuffleUnits(this.state.gameState.lastProcessedAction + 1)
            .then(this.processActions.bind(this));
    }

    handleAcceptClick() {
        this.gameBoardAdapter
            .sendActionAcceptUnits(this.state.gameState.lastProcessedAction + 1)
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
            .sendActionSelectSpecialUnits(
                this.state.setUpUnits.trap1!,
                this.state.setUpUnits.trap2!,
                this.state.setUpUnits.flag!,
                this.state.gameState.lastProcessedAction + 1
            )
            .then(this.processActions.bind(this));
    }

    processActions(response: AxiosResponse<GameActionsListResponse>) {
        const gameState = this.state.gameState.processActions(response.data.gameActions);
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
        if (this.intervalId == null) {
            // @ts-ignore
            this.intervalId = setInterval(() => {
                this.loadActions();
            }, 2000);
        }
    }

    stopCheck() {
        clearInterval(this.intervalId!);
        this.intervalId = null;
    }

    isAdjacentToSelectedField(otherField: Point) {
        const selectedField = this.state.selectedField;

        return selectedField != null && isAdjacent(selectedField, otherField) != null;
    }

    handleMoveUnit(from: Point, to: Point) {
        this.moveUnit(from, to);
    }

    handlePlaceSpecialUnit(setUpUnits: GameSetupState) {
        this.setState({setUpUnits});
    }

    handleFieldClick(location: Point) {
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

    handleFieldClickStateSetup({x, y}: Point) {
        const gameState = this.state.gameState;
        const setUpUnits = this.state.setUpUnits;
        const unit = gameState.board![y][x];

        if (!gameState.acceptedUnits || gameState.acceptedSpecialUnits) {
            return;
        }
        if (unit !== null && unit.team === this.team && unit.type !== UnitType.FLAG) {
            if (setUpUnits.trap1 == null) {
                setUpUnits.trap1 = new Point(x, y);
            } else if (setUpUnits.trap2 == null) {
                setUpUnits.trap2 = new Point(x, y);
            } else {
                setUpUnits.flag = new Point(x, y);
            }
        }

        this.setState({setUpUnits});
    }

    handleFieldClickStateTurn(location: Point) {
        const gameState = this.state.gameState;
        const unit = gameState.board![location.y][location.x];

        if (unit !== null &&
            unit.isMovable() &&
            unit.isInTeam(this.team) &&
            this.team === gameState.activeTeam) {

            this.setState({
                selectedField: location,
            });
            return;
        }

        // clicking on neigbouring field
        if (this.isAdjacentToSelectedField(location)) {
            this.moveUnit(this.state.selectedField!, location);
        }

        // clicking on invalid field
        this.setState({
            selectedField: null
        })
    }

    render() {
        const gameState = this.state.gameState;
        if (gameState.board == null) {
            return <div/>;
        }

        const turnView = gameState.activeTeam != null ?
            <span className={gameState.activeTeam.getName()}>{gameState.activeTeam.getName()}</span> : null;

        return (
            <div className="container">
                <div className="state">GameBoard | Turn: {turnView} |
                    <GameStartOptions gameState={this.state.gameState}
                                      onShuffleClick={this.handleShuffleClick}
                                      onAcceptClick={this.handleAcceptClick}/>
                    <GameStartUnitSelect gameState={this.state.gameState}
                                         setUpUnits={this.state.setUpUnits}
                                         onResetClick={this.handleRestUnitsClick}
                                         onAcceptClick={this.handleAcceptSpecialUnitsClick}/>
                </div>
                <GameBoard team={this.team}
                           gameState={this.state.gameState}
                           setUpUnits={this.state.setUpUnits}
                           onMoveUnit={this.handleMoveUnit}
                           onPlaceSpecialUnit={this.handlePlaceSpecialUnit}/>
                <FightUnitSelector gameState={this.state.gameState.gameState}
                                   team={this.team}
                                   choice={this.state.gameState.fightChoice}
                                   onChooseUnit={this.handleFightUnitChosen}/>
                <GameLog gameActions={this.state.gameState.actions} />
            </div>
        )
    }
}
