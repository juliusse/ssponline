export const Team = {
    RED: {
        api: 'RED',
        name: 'red',
        imgColor: 'r',
        color: 'red'
    },
    BLUE: {
        api: 'BLUE',
        name: 'blue',
        imgColor: 'b',
        color: 'blue'
    }
}

export const GameState = {
    CONFIGURE: 'CONFIGURE',
    TURN: 'TURN',
    MOVE_UNIT: 'MOVE_UNIT',
    FIGHT: 'FIGHT',
}

const theme = 'figuren';
export const UnitType = {
    ROCK: {
        api: 'ROCK',
        name: 'rock',
        src: (color) => `/assets/img/${theme}/${color}_stein.gif`,
    },
    PAPER: {
        api: 'PAPER',
        name: 'paper',
        src: (color) => `/assets/img/${theme}/${color}_papier.gif`,
    },
    SCISSORS: {
        api: 'SCISSORS',
        name: 'scissors',
        src: (color) => `/assets/img/${theme}/${color}_schere.gif`,
    },
    TRAP: {
        api: 'TRAP',
        name: 'trap',
        src: (color) => `/assets/img/${theme}/${color}_falle.gif`
    },
    FLAG: {
        api: 'FLAG',
        name: 'flag',
        src: (color) => `/assets/img/${theme}/${color}_flagge.gif`
    },
    HIDDEN: {
        api: 'HIDDEN',
        name: 'flag',
        src: (color) => `/assets/img/${theme}/${color}_frage.gif`
    },
    FIGHT: {
        api: 'FIGHT',
        name: 'fight',
        src: () => `/assets/img/${theme}/kampf.gif`
    },
};

export const Direction = {
    UP: {
        src: `/assets/img/oldschool/pfeil_o.gif`
    },
    DOWN: {
        src: `/assets/img/oldschool/pfeil_u.gif`
    },
    LEFT: {
        src: `/assets/img/oldschool/pfeil_l.gif`
    },
    RIGHT: {
        src: `/assets/img/oldschool/pfeil_r.gif`
    },
}
