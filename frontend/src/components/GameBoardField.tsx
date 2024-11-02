import React from "react";
import "./GameBoardField.sass";
import { Unit } from "./Unit";
import { GameState, UNIT_THEME, UnitType } from "@/constants/Constants";
import { Point } from "@/model/Point";
import { GameStateModel } from "@/model/GameStateModel";
import { UnitModel } from "@/model/UnitModel";
import { GameSetupState } from "./Game";
import { GameActionType } from "@/model/gameaction/GameActionType";
import { directionToImg, invertDirection, isAdjacent } from "@/utils/LocationUtils";

type GameBoardFieldProps = {
  state: GameStateModel;
  setUpUnits: GameSetupState;
  selectedField: Point | null;
  location: Point;
  color: string;
  displayInverted: boolean;
  onClick: (location: Point) => void;
}

export class GameBoardField extends React.Component<GameBoardFieldProps> {
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

  isUnitsTeamTurn() {
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

  classSelected(): string {
    const selectedField = this.props.selectedField;
    return this.location.isEqual(selectedField) ? "selected" : "";
  }

  isClickable(): boolean {
    const gameState = this.props.state.gameState;
    const playerTeam = this.props.state.playerTeam;
    const unit = this.getUnit();
    if (gameState === GameState.SETUP ||
      (gameState === GameState.TURN &&
        unit?.team === playerTeam &&
        unit.isMovable() &&
        this.isUnitsTeamTurn())) {
      return true;
    }

    return false;
  }

  render() {
    const unit = this.getUnit();
    let isClickable = this.isClickable();
    let content = <Unit model={unit} isActive={false} onClick={() => null} />;

    if (this.props.state.gameState === GameState.SETUP) {
      if (this.location.isEqual(this.props.setUpUnits.trap1) ||
        this.location.isEqual(this.props.setUpUnits.trap2)) {
        const trap = new UnitModel(this.props.state.playerTeam, UnitType.TRAP, false);
        content = <img alt={trap.getName()} src={trap.getImage()} />;
      }
      if (this.location.isEqual(this.props.setUpUnits.flag)) {
        const flag = new UnitModel(this.props.state.playerTeam, UnitType.FLAG, false);
        content = <img alt={flag.getName()} src={flag.getImage()} />;
      }
    }

    const lastAction = this.props.state.getLastAction();
    if (lastAction && lastAction.actionType === GameActionType.MOVE) {
      const adjacentDirection = isAdjacent(lastAction.to!, this.location);

      if (this.location.isEqual(lastAction.from!) && adjacentDirection) {
        const direction = this.props.displayInverted ? adjacentDirection : invertDirection(adjacentDirection);
        content = directionToImg(direction);
      }
    }

    if (this.isFightLocation()) {
      content = <img alt="fight" src={`/assets/img/${UNIT_THEME}/kampf.gif`} />;
    }

    if (!this.isUnitsTeamTurn() && this.props.selectedField != null) {
      const selectedField = this.props.selectedField;
      const direction = isAdjacent(selectedField, this.props.location);

      if (direction != null) {
        const displayedDirection = this.props.displayInverted ? invertDirection(direction) : direction;
        isClickable = true;
        content = directionToImg(displayedDirection);
      }
    }

    const isClickableClass = isClickable ? "clickable" : "";
    const classes = `GameBoardField ${this.props.color} ${this.classSelected()} ${isClickableClass}`;
    return (
      <div className={classes} onClick={this.handleClick}>
        {content}
      </div>
    );
  }
}
