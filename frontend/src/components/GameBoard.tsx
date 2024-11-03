import "./GameBoard.sass";
import { GameState, UnitType } from "@/constants/Constants";
import { GameStateModel } from "@/model/GameStateModel";
import { Point } from "@/model/Point";
import { GameSetupState } from "./Game";
import { isAdjacent } from "@/utils/LocationUtils";
import Team from "@/model/Team";
import { useState } from "react";
import GameBoardField from "@/components/GameBoardField";

type GameBoardProps = {
  team: Team;
  gameState: GameStateModel;
  isShadowState: boolean;
  setUpUnits: GameSetupState;
  onMoveUnit: (from: Point, to: Point) => void;
  onPlaceSpecialUnit: (setUpUnits: GameSetupState) => void;
}

const GameBoard = ({ team, gameState, isShadowState, setUpUnits, onMoveUnit, onPlaceSpecialUnit }: GameBoardProps) => {
  const [selectedField, setSelectedField] = useState<Point | null>(null);

  const isAdjacentToSelectedField = (otherField: Point) => {
    return selectedField != null && isAdjacent(selectedField, otherField) != null;
  };

  const handleFieldClick = (location: Point) => {
    if (isShadowState) {
      return;
    }

    if (gameState.gameState === GameState.SETUP) {
      handleFieldClickStateSetup(location);
      return;
    }

    if (gameState.gameState === GameState.TURN) {
      handleFieldClickStateTurn(location);
      return;
    }
  };

  const handleFieldClickStateSetup = ({ x, y }: Point) => {
    const unit = gameState.board![y][x];

    if (!gameState.acceptedUnits || gameState.acceptedSpecialUnits) {
      return;
    }
    if (unit !== null && unit.team === team && unit.type !== UnitType.FLAG) {
      if (setUpUnits.trap1 == null) {
        setUpUnits.trap1 = new Point(x, y);
      } else if (setUpUnits.trap2 == null) {
        setUpUnits.trap2 = new Point(x, y);
      } else {
        setUpUnits.flag = new Point(x, y);
      }
    }

    onPlaceSpecialUnit(setUpUnits);
  };

  const handleFieldClickStateTurn = (location: Point) => {
    const unit = gameState.board![location.y][location.x];

    const fieldHasUnitInMyTeam = unit !== null && unit.isInTeam(team);
    if (fieldHasUnitInMyTeam &&
      unit!.isMovable() &&
      team === gameState.activeTeam) {

      setSelectedField(location);
      return;
    }

    // clicking on neigbouring field
    if (!fieldHasUnitInMyTeam && isAdjacentToSelectedField(location)) {
      onMoveUnit(selectedField!, location);
    }

    // clicking on invalid field
    setSelectedField(null);
  };

  if (gameState.board == null) {
    return <div />;
  }

  const fields = [];
  fields.push(<div key={"row_header"} className="gameboard_row">
      <div className="gameboard_row_number" />
      <div className="gameboard_column_number"><span>1</span></div>
      <div className="gameboard_column_number"><span>2</span></div>
      <div className="gameboard_column_number"><span>3</span></div>
      <div className="gameboard_column_number"><span>4</span></div>
      <div className="gameboard_column_number"><span>5</span></div>
      <div className="gameboard_column_number"><span>6</span></div>
      <div className="gameboard_column_number"><span>7</span></div>
    </div>,
  );

  const displayInverted = team === Team.RED;
  for (let i = 0; i < 6; i++) {
    const y = displayInverted ? 5 - i : i;
    const row = [];
    row.push(<div className="gameboard_row_number" key={`row-number-${y + 1}`}><span>{y + 1}</span></div>);
    for (let j = 0; j < 7; j++) {
      const x = displayInverted ? 6 - j : j;
      const color = (x + y) % 2 === 0 ? "green" : "white";
      row.push(<GameBoardField
        state={gameState}
        setUpUnits={setUpUnits}
        selectedField={selectedField}
        key={`field_${x}_${y}`}
        location={new Point(x, y)}
        color={color}
        onClick={handleFieldClick}
        displayInverted={displayInverted}
      />);
    }

    fields.push(<div key={`row_${y}`} className="gameboard_row">{row}</div>);
  }

  return (
    <div className="GameBoard">
      {fields}
    </div>
  );
};

export default GameBoard;