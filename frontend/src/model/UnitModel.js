export class UnitModel {
    constructor({team, type}) {
        this.team = team;
        this.type = type;
    }

    getImage() {
        return this.type.src(this.team && this.team.imgColor);
    }

    getName() {
        return this.type.name;
    }
}
