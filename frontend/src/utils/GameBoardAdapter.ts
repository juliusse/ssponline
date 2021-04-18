import axios, {AxiosPromise} from "axios";
import {AppConfig} from "../config";
import {Team} from "../model/Team";
import {Point} from "../model/Point";
import {UnitType} from "../constants/Constants";
import {GameAction} from "../model/gameaction/GameAction";

export type GameActionsResponse = {
    gameActions: Array<GameAction>;
}

export class GameBoardAdapter {
    readonly gameId: string;
    readonly requestingTeam: Team;

    constructor(gameId: string, requestingTeam: Team) {
        this.gameId = gameId;
        this.requestingTeam = requestingTeam;
    }

    getActionsAsync(fromIndex = 0): AxiosPromise<GameActionsResponse> {
        return axios({
            url: AppConfig.backendUrl + `/game/${this.gameId}`,
            params: {
                requestingPlayer: this.requestingTeam.getApi(),
                fromIndex
            }
        });
    }

    sendActionShuffleUnits(fromIndex: number): AxiosPromise<GameActionsResponse> {
        return this.sendAction({
            actionType: 'SHUFFLE_UNITS'
        }, fromIndex);
    }

    sendActionAcceptUnits(fromIndex: number): AxiosPromise<GameActionsResponse> {
        return this.sendAction({
            actionType: 'ACCEPT_UNITS'
        }, fromIndex);
    }

    sendActionSelectSpecialUnits(trap1: Point, trap2: Point, flag: Point, fromIndex: number): AxiosPromise<GameActionsResponse> {
        return this.sendAction({
            actionType: 'SET_SPECIAL_UNITS',
            trap1, trap2, flag
        }, fromIndex);
    }

    sendActionMoveUnit(from: Point, to: Point, fromIndex: number): AxiosPromise<GameActionsResponse> {
        return this.sendAction({
            actionType: 'MOVE'
            , from, to
        }, fromIndex);
    }

    sendActionFightUnitChosen(unitType: UnitType, fromIndex: number): AxiosPromise<GameActionsResponse> {
        return this.sendAction({
            actionType: 'FIGHT_CHOOSE_UNIT',
            unitType
        }, fromIndex);
    }

    sendAction(data: any, fromIndex: number): AxiosPromise<GameActionsResponse> {
        return axios({
            method: 'post',
            url: AppConfig.backendUrl + `/game/${this.gameId}/action`,
            data,
            params: {
                requestingPlayer: this.requestingTeam.getApi(),
                fromIndex
            }
        })
    }
}
