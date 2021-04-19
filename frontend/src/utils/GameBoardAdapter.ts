import axios, {AxiosPromise} from "axios";
import {AppConfig} from "../config";
import {Team} from "../model/Team";
import {Point} from "../model/Point";
import {GameState, UnitType} from "../constants/Constants";
import {GameAction} from "../model/gameaction/GameAction";
import {GameActionResponse} from "../model/gameaction/response/GameActionResponse";
import {GameActionType} from "../model/gameaction/GameActionType";
import {GameActionUnit} from "../model/gameaction/GameActionUnit";

export type GameActionsListResponse = {
    gameActions: Array<GameAction>;
}

export class GameBoardAdapter {
    readonly gameId: string;
    readonly requestingTeam: Team;

    constructor(gameId: string, requestingTeam: Team) {
        this.gameId = gameId;
        this.requestingTeam = requestingTeam;
    }

    getActionsAsync(fromIndex = 0): AxiosPromise<GameActionsListResponse> {
        return axios({
            url: AppConfig.backendUrl + `/game/${this.gameId}`,
            transformResponse: this.toGameAction,
            params: {
                requestingPlayer: this.requestingTeam.getApi(),
                fromIndex
            }
        });
    }

    sendActionShuffleUnits(fromIndex: number): AxiosPromise<GameActionsListResponse> {
        return this.sendAction({
            actionType: 'SHUFFLE_UNITS'
        }, fromIndex);
    }

    sendActionAcceptUnits(fromIndex: number): AxiosPromise<GameActionsListResponse> {
        return this.sendAction({
            actionType: 'ACCEPT_UNITS'
        }, fromIndex);
    }

    sendActionSelectSpecialUnits(trap1: Point, trap2: Point, flag: Point, fromIndex: number): AxiosPromise<GameActionsListResponse> {
        return this.sendAction({
            actionType: 'SET_SPECIAL_UNITS',
            trap1, trap2, flag
        }, fromIndex);
    }

    sendActionMoveUnit(from: Point, to: Point, fromIndex: number): AxiosPromise<GameActionsListResponse> {
        return this.sendAction({
            actionType: 'MOVE'
            , from, to
        }, fromIndex);
    }

    sendActionFightUnitChosen(unitType: UnitType, fromIndex: number): AxiosPromise<GameActionsListResponse> {
        return this.sendAction({
            actionType: 'FIGHT_CHOOSE_UNIT',
            unitType
        }, fromIndex);
    }

    sendAction(data: any, fromIndex: number): AxiosPromise<GameActionsListResponse> {
        return axios({
            method: 'post',
            url: AppConfig.backendUrl + `/game/${this.gameId}/action`,
            transformResponse: this.toGameAction,
            data,
            params: {
                requestingPlayer: this.requestingTeam.getApi(),
                fromIndex
            }
        })
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
            gameActions
        };
    }
}
