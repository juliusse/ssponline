import {GameActionUnit} from "./GameActionUnit";
import {GameActionType} from "./GameActionType";
import {Team} from "../Team";
import {GameState, UnitType} from "../../constants/Constants";
import {Point} from "../Point";

export class GameAction {
    readonly gameId: string;
    readonly timestamp: number;
    readonly actionId: number;
    readonly actionType: GameActionType;
    readonly activeTeam: Team | null;
    readonly gameState: GameState;

    // TODO create subtypes
    // shuffle & special units
    readonly units: Array<GameActionUnit> | null = null;
    readonly team: Team | null = null;

    // move
    readonly unitType: UnitType | null = null;
    readonly from: Point | null = null;
    readonly to: Point | null = null;

    // fight
    readonly winningTeam: Team | null = null;
    readonly redType: UnitType | null = null;
    readonly blueType: UnitType | null = null;
    readonly location: Point | null = null;

    // choose unit
    readonly type: UnitType | null = null;


    // TODO split in sub classes
    constructor(gameId: string, timestamp: number, actionId: number, actionType: GameActionType, activeTeam: Team | null, gameState: GameState, units: Array<GameActionUnit> | null, team: Team | null, unitType: UnitType | null, from: Point | null, to: Point | null, winningTeam: Team | null, redType: UnitType | null, blueType: UnitType | null, location: Point | null, type: UnitType | null) {
        this.gameId = gameId;
        this.timestamp = timestamp;
        this.actionId = actionId;
        this.actionType = actionType;
        this.activeTeam = activeTeam;
        this.gameState = gameState;
        this.units = units;
        this.team = team;
        this.unitType = unitType;
        this.from = from;
        this.to = to;
        this.winningTeam = winningTeam;
        this.redType = redType;
        this.blueType = blueType;
        this.location = location;
        this.type = type;
    }
}
