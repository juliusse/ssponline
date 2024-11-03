import { UnitModel } from "@/model/UnitModel";
import { GameState, UnitType } from "@/constants/Constants";
import "./FightUnitSelector.sass";
import Team from "@/model/Team";
import Unit from "@/components/Unit";

type FightUnitSelectorProps = {
  gameState: GameState | null;
  onChooseUnit: (unitType: UnitType) => void;
  choice: UnitType | null;
  team: Team;
}

const FightUnitSelector = ({ gameState, onChooseUnit, choice, team }: FightUnitSelectorProps) => {
  if (gameState !== GameState.FIGHT) {
    return <div className="FightUnitSelector" />;
  }

  return (
    <div className="FightUnitSelector">
      <div className="title">Select a Unit!</div>
      <div className="units">
        <div>
          <Unit isActive={choice === UnitType.ROCK}
                onClick={onChooseUnit}
                model={new UnitModel(team, UnitType.ROCK, false)} />
        </div>
        <div>
          <Unit isActive={choice === UnitType.PAPER}
                onClick={onChooseUnit}
                model={new UnitModel(team, UnitType.PAPER, false)} />
        </div>
        <div>
          <Unit isActive={choice === UnitType.SCISSORS}
                onClick={onChooseUnit}
                model={new UnitModel(team, UnitType.SCISSORS, false)} />
        </div>
      </div>
    </div>
  );
};

export default FightUnitSelector;
