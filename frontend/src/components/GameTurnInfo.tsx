import React from "react";
import "./GameTurnInfo.sass";
import { GameAction } from "@/model/gameaction/GameAction";
import { GameActionType } from "@/model/gameaction/GameActionType";
import { GameSetupState } from "./Game";
import Team from "@/model/Team";

type Props = {
  playerTeam: Team;
  actions: Array<GameAction>;
  setUpUnits: GameSetupState;
  onShuffleClick: React.MouseEventHandler<HTMLButtonElement>;
  onAcceptShuffleClick: React.MouseEventHandler<HTMLButtonElement>;
  onResetSpecialUnitsClick: React.MouseEventHandler<HTMLButtonElement>;
  onAcceptSpecialUnitsClick: React.MouseEventHandler<HTMLButtonElement>;
}

export class GameTurnInfo extends React.Component<Props> {

  getMoveTurnInfoContent(action: GameAction) {
    const isMyAction = action.activeTeam === this.props.playerTeam;

    return isMyAction ?
      <div className="GameTurnInfoContent">
        Your turn! Move a unit.
      </div>
      :
      <div className="GameTurnInfoContent">
        Opponents turn... wait until your opponent made a move.
      </div>;
  }


  toTurnInfo(actions: Array<GameAction>): JSX.Element {
    let content = <div />;
    actions.forEach(action => {
      const isMyAction = action.team === this.props.playerTeam;

      switch (action.actionType) {
        case GameActionType.CONFIGURE:
        case GameActionType.SHUFFLE_UNITS:
          if (!isMyAction) {
            break;
          }
          content =
            <div className="GameTurnInfoContent">
              Please
              <button onClick={this.props.onShuffleClick}>Shuffle Units</button>
              until you are happy and then
              <button onClick={this.props.onAcceptShuffleClick}>Accept Units</button>
            </div>;
          break;
        case GameActionType.ACCEPT_UNITS:
          if (!isMyAction) {
            break;
          }

          const trapsAreSet = this.props.setUpUnits.trap1 && this.props.setUpUnits.trap2;
          const flagIsSet = this.props.setUpUnits.flag;
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
                <button onClick={this.props.onAcceptSpecialUnitsClick}>Accept them</button>
                <br />
                Otherwise you can
                <button onClick={this.props.onResetSpecialUnitsClick}>Reset them</button>
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
          content = this.getMoveTurnInfoContent(action);
          break;
        case GameActionType.FIGHT:
          if (action.winningTeam) {
            content = this.getMoveTurnInfoContent(action);
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

  render() {
    return (
      <div className="GameTurnInfo">
        {this.toTurnInfo(this.props.actions)}
      </div>
    );
  }
}
