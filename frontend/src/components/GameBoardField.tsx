import "./GameBoardField.sass";
import { GameState, UNIT_THEME, UnitType } from "@/constants/Constants";
import { Point } from "@/model/Point";
import { GameStateModel } from "@/model/GameStateModel";
import { UnitModel } from "@/model/UnitModel";
import { GameSetupState } from "./Game";
import { GameActionType } from "@/model/gameaction/GameActionType";
import { directionToImg, invertDirection, isAdjacent } from "@/utils/LocationUtils";
import Unit from "@/components/Unit";

type GameBoardFieldProps = {
  state: GameStateModel;
  setUpUnits: GameSetupState;
  selectedField: Point | null;
  location: Point;
  color: string;
  displayInverted: boolean;
  onClick: (location: Point) => void;
}

const GameBoardField = ({
                          state,
                          setUpUnits,
                          selectedField,
                          location,
                          color,
                          displayInverted,
                          onClick,
                        }: GameBoardFieldProps) => {


  const getUnit = (): UnitModel | null => {
    return state.board![location.y][location.x];
  };

  const isUnitsTeamTurn = () => {
    const unit = getUnit();
    return unit != null && unit.team === state.activeTeam;
  };

  const isFightLocation = () => {
    const fightLocation = state.fightLocation;
    if (fightLocation == null) {
      return;
    }

    return fightLocation.isEqual(location);
  };

  const classSelected = (): string => {
    return location.isEqual(selectedField) ? "selected" : "";
  };

  const isClickable = (): boolean => {
    const gameState = state.gameState;
    const playerTeam = state.playerTeam;
    const unit = getUnit();
    if (gameState === GameState.SETUP ||
      (gameState === GameState.TURN &&
        unit?.team === playerTeam &&
        unit.isMovable() &&
        isUnitsTeamTurn())) {
      return true;
    }

    return false;
  };

  const unit = getUnit();
  let isClickableValue = isClickable();
  let content = <Unit model={unit} isActive={false} onClick={() => null} />;

  if (state.gameState === GameState.SETUP) {
    if (location.isEqual(setUpUnits.trap1) ||
      location.isEqual(setUpUnits.trap2)) {
      const trap = new UnitModel(state.playerTeam, UnitType.TRAP, false);
      content = <img alt={trap.getName()} src={trap.getImage()} />;
    }
    if (location.isEqual(setUpUnits.flag)) {
      const flag = new UnitModel(state.playerTeam, UnitType.FLAG, false);
      content = <img alt={flag.getName()} src={flag.getImage()} />;
    }
  }

  const lastAction = state.getLastAction();
  if (lastAction && lastAction.actionType === GameActionType.MOVE) {
    const adjacentDirection = isAdjacent(lastAction.to!, location);

    if (location.isEqual(lastAction.from!) && adjacentDirection) {
      const direction = displayInverted ? adjacentDirection : invertDirection(adjacentDirection);
      content = directionToImg(direction);
    }
  }

  if (isFightLocation()) {
    content = <img alt="fight" src={`/assets/img/${UNIT_THEME}/kampf.gif`} />;
  }

  if (!isUnitsTeamTurn() && selectedField != null) {
    const direction = isAdjacent(selectedField, location);

    if (direction != null) {
      const displayedDirection = displayInverted ? invertDirection(direction) : direction;
      isClickableValue = true;
      content = directionToImg(displayedDirection);
    }
  }

  const isClickableClass = isClickableValue ? "clickable" : "";
  const classes = `GameBoardField ${color} ${classSelected()} ${isClickableClass}`;
  return (
    <div className={classes} onClick={() => onClick(location)}>
      {content}
    </div>
  );
};

export default GameBoardField;
