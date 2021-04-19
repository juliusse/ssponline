export class GameActionResponse {
    readonly gameId: string;
    readonly timestamp: number;
    readonly actionId: number;
    readonly actionType: string;
    readonly activeTeam: string | null;
    readonly gameState: string;

    // TODO create subtypes
    // shuffle & special units
    readonly units: Array<any> | null = null;
    readonly team: string | null = null;

    // move
    readonly unitType: string | null = null;
    readonly from: any | null = null;
    readonly to: any | null = null;

    // fight
    readonly winningTeam: string | null = null;
    readonly redType: string | null = null;
    readonly blueType: string | null = null;
    readonly location: any | null = null;

    // choose unit
    readonly type: string | null = null;


    constructor(gameId: string, timestamp: number, actionId: number, actionType: string, activeTeam: string, gameState: string) {
        this.gameId = gameId;
        this.timestamp = timestamp;
        this.actionId = actionId;
        this.actionType = actionType;
        this.activeTeam = activeTeam;
        this.gameState = gameState;
    }
}
