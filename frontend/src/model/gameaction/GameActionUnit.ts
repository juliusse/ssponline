import {Team} from "../Team";
import {UnitType} from "../../constants/Constants";
import {Point} from "../Point";

export class GameActionUnit {
    readonly team: string;
    readonly type: string;
    readonly location: Point;
    readonly visible: boolean;


    constructor(team: string, type: string, location: Point, visible: boolean) {
        this.team = team;
        this.type = type;
        this.location = location;
        this.visible = visible;
    }
}
