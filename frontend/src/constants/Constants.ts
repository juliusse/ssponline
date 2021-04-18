export enum TeamColor {
    RED = 'RED',
    BLUE = 'BLUE'
}

export enum GameState {
    SETUP = 'SETUP',
    TURN = 'TURN',
    FIGHT = 'FIGHT',
}

export const UNIT_THEME = 'figuren';

export enum UnitType {
    ROCK = 'ROCK',
    PAPER = 'PAPER',
    SCISSORS = 'SCISSORS',
    TRAP = 'TRAP',
    FLAG = 'FLAG',
    HIDDEN = 'HIDDEN',
}

export const Direction = {
    UP: {
        src: `/assets/img/${UNIT_THEME}/pfeil_o.gif`
    },
    DOWN: {
        src: `/assets/img/${UNIT_THEME}/pfeil_u.gif`
    },
    LEFT: {
        src: `/assets/img/${UNIT_THEME}/pfeil_l.gif`
    },
    RIGHT: {
        src: `/assets/img/${UNIT_THEME}/pfeil_r.gif`
    },
}
