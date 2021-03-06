import {TeamColor} from "../constants/Constants";

export class Team {
    public static RED = new Team(TeamColor.RED);
    public static BLUE = new Team(TeamColor.BLUE);

    public static getForColor(color: string) : Team {
        return color.toUpperCase() === 'RED' ? Team.RED : Team.BLUE;
    }

    readonly teamColor: TeamColor;

    private constructor(teamColor: TeamColor) {
        this.teamColor = teamColor;
    }

    public getName() {
        return this.teamColor.toLowerCase();
    }

    public getApi() {
        return this.teamColor;
    }

    public getImgColor() {
        return this.teamColor.toLowerCase()[0];
    }
}
