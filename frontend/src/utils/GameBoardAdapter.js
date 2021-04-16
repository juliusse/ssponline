import axios from "axios";
import {AppConfig} from "../config";

export class GameBoardAdapter {
    constructor({gameId, requestingTeam}) {
        this.gameId = gameId;
        this.requestingTeam = requestingTeam;
    }

    getActionsAsync({fromIndex = 0}) {
        return axios({
            url: AppConfig.backendUrl + `/game/${this.gameId}`,
            params: {
                requestingPlayer: this.requestingTeam.api,
                fromIndex
            }
        });
    }

    sendActionMoveUnit({from, to, fromIndex}) {
        return this.sendAction({ data: {actionType: 'MOVE', from, to}, fromIndex});
    }

    sendActionFightUnitChosen({unitType, fromIndex}) {
        return this.sendAction({ data: {actionType: 'FIGHT_CHOOSE_UNIT', unitType: unitType.api}, fromIndex});
    }

    sendAction({ data, fromIndex }) {
        return axios({
            method: 'post',
            url: AppConfig.backendUrl + `/game/${this.gameId}/action`,
            data,
            params: {
                requestingPlayer: this.requestingTeam.api,
                fromIndex
            }
        })
    }
}
