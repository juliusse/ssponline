import {Team} from "../Team";
import {UnitType} from "../../constants/Constants";
import {Point} from "../Point";

export class GameActionUnit {
    readonly team: Team;
    readonly type: UnitType;
    readonly location: Point;
    readonly visible: boolean;

    constructor(team: Team, type: UnitType, location: Point, visible: boolean) {
        this.team = team;
        this.type = type;
        this.location = location;
        this.visible = visible;
    }
}
