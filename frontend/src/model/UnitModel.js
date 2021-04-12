import React from 'react';

export class UnitModel {
    constructor({team, type, visible}) {
        this.team = team;
        this.type = type;
        this.visible = visible;
    }

    getImage(isMyTeamsTurn) {
        return isMyTeamsTurn || this.visible ?
            this.type.src(this.team.imgColor) :
            `./src/assets/oldschool/${this.team.imgColor}_frage.gif`;
    }
}
