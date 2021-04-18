import {GameActionUnit} from "./GameActionUnit";

export class GameAction {
    readonly gameId: string;
    readonly actionId: number;
    readonly actionType: string;
    readonly activeTeam: string | null;
    readonly gameState: string;

    // TODO create subtypes
    // shuffle & special units
    readonly units: Array<GameActionUnit> | null = null;
    readonly team: string | null = null;

    // move
    readonly from: any | null = null;
    readonly to: any | null = null;

    // fight
    readonly winningTeam: string | null = null;
    readonly redType: string | null = null;
    readonly blueType: string | null = null;
    readonly location: any | null = null;

    // choose unit
    readonly type: string | null = null;


    constructor(gameId: string, actionId: number, actionType: string, activeTeam: string, gameState: string) {
        this.gameId = gameId;
        this.actionId = actionId;
        this.actionType = actionType;
        this.activeTeam = activeTeam;
        this.gameState = gameState;
    }
}
