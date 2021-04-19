import React from 'react';
import './GameBoard.sass';
import {GameBoardField} from "./GameBoardField";
import {GameState, UnitType} from "../constants/Constants";
import {isAdjacent} from "../utils/Utils";
import {GameStateModel} from "../model/GameStateModel";
import {Team} from "../model/Team";
import {Point} from "../model/Point";
import {GameSetupState} from "./Game";

type GameBoardProps = {
    team: Team;
    gameState: GameStateModel;
    isShadowState: boolean;
    setUpUnits: GameSetupState;
    onMoveUnit: Function;
    onPlaceSpecialUnit: Function;
}

type GameBoardState = {
    selectedField: Point | null
}

export class GameBoard extends React.Component<GameBoardProps, GameBoardState> {
    readonly team: Team;

    constructor(props: GameBoardProps) {
        super(props);
        this.team = props.team;
        this.state = {
            selectedField: null,
        };
        this.handleFieldClick = this.handleFieldClick.bind(this);
    }

    isMyTurn() {
        return this.team === this.props.gameState.activeTeam;
    }

    isAdjacentToSelectedField(otherField: Point) {
        const selectedField = this.state.selectedField;

        return selectedField != null && isAdjacent(selectedField, otherField) != null;
    }

    handleFieldClick(location: Point) {
        if (this.props.isShadowState) {
            return;
        }

        const gameState = this.props.gameState;

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
        const gameState = this.props.gameState;
        const setUpUnits = this.props.setUpUnits;
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

        this.props.onPlaceSpecialUnit(setUpUnits);
    }

    handleFieldClickStateTurn(location: Point) {
        const gameState = this.props.gameState;
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
            this.props.onMoveUnit(this.state.selectedField!, location);
        }

        // clicking on invalid field
        this.setState({
            selectedField: null
        })
    }

    render() {
        const gameState = this.props.gameState;
        if (gameState.board == null) {
            return <div/>;
        }
        const fields = [];
        fields.push(<div key={`row_header`} className="gameboard_row">
                <div className='gameboard_row_number'/>
                <div className='gameboard_column_number'><span>1</span></div>
                <div className='gameboard_column_number'><span>2</span></div>
                <div className='gameboard_column_number'><span>3</span></div>
                <div className='gameboard_column_number'><span>4</span></div>
                <div className='gameboard_column_number'><span>5</span></div>
                <div className='gameboard_column_number'><span>6</span></div>
                <div className='gameboard_column_number'><span>7</span></div>
            </div>
        )
        for (let y = 0; y < 6; y++) {
            const row = [];
            row.push(<div className="gameboard_row_number" key={`row-number-${y + 1}`}><span>{y + 1}</span></div>)
            for (let x = 0; x < 7; x++) {
                const color = (x + y) % 2 === 0 ? "green" : "white";
                row.push(<GameBoardField
                    state={gameState}
                    setUpUnits={this.props.setUpUnits}
                    selectedField={this.state.selectedField}
                    key={`field_${x}_${y}`}
                    location={new Point(x, y)}
                    color={color}
                    onClick={this.handleFieldClick}
                />);
            }

            fields.push(<div key={`row_${y}`} className="gameboard_row">{row}</div>);
        }

        return (
            <div className="GameBoard">
                {fields}
            </div>
        )
    }
}
