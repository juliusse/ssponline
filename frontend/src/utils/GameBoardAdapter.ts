import axios from "axios";
import { Point } from "@/model/Point";
import { GameState, UnitType } from "@/constants/Constants";
import { GameAction } from "@/model/gameaction/GameAction";
import { GameActionResponse } from "@/model/gameaction/response/GameActionResponse";
import { GameActionType } from "@/model/gameaction/GameActionType";
import { GameActionUnit } from "@/model/gameaction/GameActionUnit";
import Team from "@/model/Team";

export type GameActionsListResponse = {
  gameActions: Array<GameAction>;
}

export class GameBoardAdapter {
  readonly gameId: string;
  readonly requestingTeam: Team;
  readonly backendUrl: string;

  constructor(gameId: string, requestingTeam: Team, backendUrl: string) {
    this.gameId = gameId;
    this.requestingTeam = requestingTeam;
    this.backendUrl = backendUrl;
  }

  async getActionsAsync(fromIndex = 0): Promise<GameActionsListResponse> {
    const response = await axios({
      url: this.backendUrl + `/game/${this.gameId}`,
      transformResponse: this.toGameAction,
      params: {
        requestingPlayer: this.requestingTeam.getApi(),
        fromIndex,
      },
    });

    return response.data;
  }

  async sendActionShuffleUnits(fromIndex: number): Promise<GameActionsListResponse> {
    return this.sendAction({
      actionType: "SHUFFLE_UNITS",
    }, fromIndex);
  }

  async sendActionAcceptUnits(fromIndex: number): Promise<GameActionsListResponse> {
    return this.sendAction({
      actionType: "ACCEPT_UNITS",
    }, fromIndex);
  }

  async sendActionSelectSpecialUnits(trap1: Point, trap2: Point, flag: Point, fromIndex: number): Promise<GameActionsListResponse> {
    return this.sendAction({
      actionType: "SET_SPECIAL_UNITS",
      trap1, trap2, flag,
    }, fromIndex);
  }

  async sendActionMoveUnit(from: Point, to: Point, fromIndex: number): Promise<GameActionsListResponse> {
    return this.sendAction({
      actionType: "MOVE"
      , from, to,
    }, fromIndex);
  }

  async sendActionFightUnitChosen(unitType: UnitType, fromIndex: number): Promise<GameActionsListResponse> {
    return this.sendAction({
      actionType: "FIGHT_CHOOSE_UNIT",
      unitType,
    }, fromIndex);
  }

  async sendAction(data: any, fromIndex: number): Promise<GameActionsListResponse> {
    const response = await
     axios({
      method: "post",
      url: this.backendUrl + `/game/${this.gameId}/action`,
      transformResponse: this.toGameAction,
      data,
      params: {
        requestingPlayer: this.requestingTeam.getApi(),
        fromIndex,
      },
    });
    return response.data;
  }

  toGameAction(response: string): GameActionsListResponse {
    const responseJson = JSON.parse(response);
    if (responseJson.statusCode) {
      return responseJson;
    }
    const gameActions = responseJson.gameActions
      .map((action: GameActionResponse) => {
        const actionType = GameActionType[action.actionType as keyof typeof GameActionType];
        const activeTeam = action.activeTeam ? Team.getForColor(action.activeTeam) : null;
        const gameState = GameState[action.gameState as keyof typeof GameState];

        const units = action.units ?
          action.units
            .map(unit => {
              const team = Team.getForColor(unit.team);
              const type = UnitType[unit.type as keyof typeof UnitType];
              const location = new Point(unit.location.x, unit.location.y);

              return new GameActionUnit(team, type, location, unit.visible);
            }) : null;
        const team = action.team ? Team.getForColor(action.team) : null;

        const unitType = action.unitType ? UnitType[action.unitType as keyof typeof UnitType] : null;
        const from = action.from ? new Point(action.from.x, action.from.y) : null;
        const to = action.to ? new Point(action.to.x, action.to.y) : null;

        const winningTeam = action.winningTeam ? Team.getForColor(action.winningTeam) : null;
        const redType = action.redType ? UnitType[action.redType as keyof typeof UnitType] : null;
        const blueType = action.blueType ? UnitType[action.blueType as keyof typeof UnitType] : null;
        const location = action.location ? new Point(action.location.x, action.location.y) : null;

        const type = action.type ? UnitType[action.type as keyof typeof UnitType] : null;

        return new GameAction(
          action.gameId,
          action.timestamp,
          action.actionId,
          actionType,
          activeTeam,
          gameState,
          units,
          team,
          unitType,
          from,
          to,
          winningTeam,
          redType,
          blueType,
          location,
          type);
      });

    return {
      gameActions,
    };
  }
}
