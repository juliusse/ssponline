import React from "react";
import "./GameTurnInfo.sass";
import { GameAction } from "@/model/gameaction/GameAction";
import { GameActionType } from "@/model/gameaction/GameActionType";
import { GameSetupState } from "./Game";
import Team from "@/model/Team";

type GameTurnInfoProps = {
  playerTeam: Team;
  actions: Array<GameAction>;
  setUpUnits: GameSetupState;
  onShuffleClick: React.MouseEventHandler<HTMLButtonElement>;
  onAcceptShuffleClick: React.MouseEventHandler<HTMLButtonElement>;
  onResetSpecialUnitsClick: React.MouseEventHandler<HTMLButtonElement>;
  onAcceptSpecialUnitsClick: React.MouseEventHandler<HTMLButtonElement>;
}

const GameTurnInfo = ({ playerTeam, actions, setUpUnits, onShuffleClick, onAcceptShuffleClick, onResetSpecialUnitsClick, onAcceptSpecialUnitsClick }: GameTurnInfoProps) => {

  const MoveTurnInfoContent = ({action} : {action: GameAction}) => {
    const isMyAction = action.activeTeam === playerTeam;

    return isMyAction ?
      <div className="GameTurnInfoContent">
        Your turn! Move a unit.
      </div>
      :
      <div className="GameTurnInfoContent">
        Opponents turn... wait until your opponent made a move.
      </div>;
  }


  const TurnInfo = ({ actions } : {actions : Array<GameAction>}) => {
    let content = <div />;
    actions.forEach(action => {
      const isMyAction = action.team === playerTeam;

      switch (action.actionType) {
        case GameActionType.CONFIGURE:
        case GameActionType.SHUFFLE_UNITS:
          if (!isMyAction) {
            break;
          }
          content =
            <div className="GameTurnInfoContent">
              Please
              <button onClick={onShuffleClick}>Shuffle Units</button>
              until you are happy and then
              <button onClick={onAcceptShuffleClick}>Accept Units</button>
            </div>;
          break;
        case GameActionType.ACCEPT_UNITS:
          if (!isMyAction) {
            break;
          }

          const trapsAreSet = setUpUnits.trap1 && setUpUnits.trap2;
          const flagIsSet = setUpUnits.flag;
          if (!trapsAreSet) {
            content =
              <div className="GameTurnInfoContent">
                You can place two traps. Please select the locations.
              </div>;
          } else if (!flagIsSet) {
            content =
              <div className="GameTurnInfoContent">
                The Goal of the game is to capture the opponents flag.
                Select a location where your flag should be.
              </div>;
          } else {
            content =
              <div className="GameTurnInfoContent">
                If your units are set correctly
                <button onClick={onAcceptSpecialUnitsClick}>Accept them</button>
                <br />
                Otherwise you can
                <button onClick={onResetSpecialUnitsClick}>Reset them</button>
              </div>;

          }

          break;
        case GameActionType.SET_SPECIAL_UNITS:
          if (!isMyAction) {
            break;
          }
          content =
            <div className="GameTurnInfoContent">
              The opponent hasn&lsquo;t set up their units, yet.
            </div>;
          break;
        case GameActionType.START:
        case GameActionType.MOVE:
          content = <MoveTurnInfoContent action={action} />;
          break;
        case GameActionType.FIGHT:
          if (action.winningTeam) {
            content = <MoveTurnInfoContent action={action} />;
            break;
          }

          content =
            <div className="GameTurnInfoContent">
              Fight! Select a unit for the fight.
            </div>;
          break;
        case GameActionType.FIGHT_CHOOSE_UNIT:
          if (!isMyAction) {
            break;
          }
          content =
            <div className="GameTurnInfoContent">
              Fight! The opponent hasn&lsquo;t selected a unit, yet.
            </div>;
          break;
        case GameActionType.WIN:
          content =
            <div className="GameTurnInfoContent">
              GAME OVER!{" "}
              <span className={action.team?.getName()}>{action.team?.getName()}</span>
              {" "} won the game!
            </div>;
          break;
      }
    });

    return content;
  }

    return (
      <div className="GameTurnInfo">
        <TurnInfo actions={actions} />
      </div>
    )
}

export default GameTurnInfo;
