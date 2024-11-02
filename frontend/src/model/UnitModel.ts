import { UNIT_THEME, UnitType } from "@/constants/Constants";
import { Team } from "./Team";

export class UnitModel {
  readonly team: Team;
  readonly type: UnitType;
  visible: boolean;

  constructor(team: Team, type: UnitType, visible: boolean) {
    this.team = team;
    this.type = type;
    this.visible = visible;
  }

  getImage(): string {
    let unitName: string = "";
    switch (this.type) {
      case UnitType.ROCK:
        unitName = "stein";
        break;
      case UnitType.PAPER:
        unitName = "papier";
        break;
      case UnitType.SCISSORS:
        unitName = "schere";
        break;
      case UnitType.TRAP:
        unitName = "falle";
        break;
      case UnitType.FLAG:
        unitName = "fahne";
        break;
      case UnitType.HIDDEN:
        unitName = "frage";
        break;
    }

    return `/assets/img/${UNIT_THEME}/${this.team.getImgColor()}_${unitName}.gif`;
  }

  getName() {
    return this.type.toLowerCase();
  }

  public isMovable() {
    return this.type === UnitType.ROCK ||
      this.type === UnitType.PAPER ||
      this.type === UnitType.SCISSORS;
  }

  public getType(): UnitType {
    return this.type;
  }

  public isInTeam(team: Team) {
    return this.team === team;
  }
}
