import React from 'react';
import './GameBoardField.sass';
import {isAdjacent} from "../utils/Utils";
import {Unit} from "./Unit";
import {Direction, GameState, UNIT_THEME, UnitType} from "../constants/Constants";
import {Point} from "../model/Point";
import {GameStateModel} from "../model/GameStateModel";
import {UnitModel} from "../model/UnitModel";
import {GameSetupState} from "./Game";
import {GameActionType} from "../model/gameaction/GameActionType";

type GameBoardFieldProps = {
    state: GameStateModel;
    setUpUnits: GameSetupState;
    selectedField: Point | null;
    location: Point;
    color: string;
    onClick: Function;
}

type GameBoardFieldState = {}

export class GameBoardField extends React.Component<GameBoardFieldProps, GameBoardFieldState> {
    readonly location: Point;

    constructor(props: GameBoardFieldProps) {
        super(props);
        this.location = props.location;
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onClick(this.location);
    }

    getUnit(): UnitModel | null {
        return this.props.state.board![this.location.y][this.location.x];
    }

    isMyTeamsTurn() {
        const unit = this.getUnit();
        return unit != null && unit.team === this.props.state.activeTeam;
    }

    isFightLocation() {
        const fightLocation = this.props.state.fightLocation;
        if (fightLocation == null) {
            return;
        }

        return fightLocation.isEqual(this.location);
    }

    classSelected() {
        const selectedField = this.props.selectedField;
        return this.location.isEqual(selectedField) ? 'selected' : '';
    }

    render() {
        const unit = this.getUnit();
        let content = <Unit model={unit} isActive={false} onClick={null}/>;

        if (this.props.state.gameState === GameState.SETUP) {
            if (this.location.isEqual(this.props.setUpUnits.trap1) ||
                this.location.isEqual(this.props.setUpUnits.trap2)) {
                const trap = new UnitModel(this.props.state.playerTeam, UnitType.TRAP, false);
                content = <img alt={trap.getName()} src={trap.getImage()}/>
            }
            if (this.location.isEqual(this.props.setUpUnits.flag)) {
                const flag = new UnitModel(this.props.state.playerTeam, UnitType.FLAG, false);
                content = <img alt={flag.getName()} src={flag.getImage()}/>
            }
        }

        const lastAction = this.props.state.getLastAction();
        if (lastAction && lastAction.actionType === GameActionType.MOVE) {
            const adjacentDirection = isAdjacent(lastAction.to!, this.location);

            if (this.location.isEqual(lastAction.from!) && adjacentDirection) {
                switch (adjacentDirection) {
                    case Direction.RIGHT:
                        content = <img alt="direction" src={Direction.LEFT.src}/>
                        break;
                    case Direction.LEFT:
                        content = <img alt="direction" src={Direction.RIGHT.src}/>
                        break;
                    case Direction.UP:
                        content = <img alt="direction" src={Direction.DOWN.src}/>
                        break;
                    case Direction.DOWN:
                        content = <img alt="direction" src={Direction.UP.src}/>
                        break;
                }
            }
        }

        if (this.isFightLocation()) {
            content = <img alt='fight' src={`/assets/img/${UNIT_THEME}/kampf.gif`}/>
        }

        if (!this.isMyTeamsTurn() && this.props.selectedField != null) {
            const selectedField = this.props.selectedField;
            const direction = isAdjacent(selectedField, this.props.location);
            if (direction != null) {
                content = <img alt="direction" src={direction.src}/>
            }
        }

        return (
            <div className={`GameBoardField ${this.props.color} ${this.classSelected()}`} onClick={this.handleClick}>
                {content}
            </div>
        )
    }
}
