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
    TURN: 'TURN',
    MOVE_UNIT: 'MOVE_UNIT',
    FIGHT: 'FIGHT',
}

export const UnitType = {
    ROCK: {
        name: 'rock',
        src: (color) => `/assets/img/oldschool/${color}_stein.gif`,
    },
    PAPER: {
        name: 'paper',
        src: (color) => `/assets/img/oldschool/${color}_papier.gif`,
    },
    SCISSORS: {
        name: 'scissors',
        src: (color) => `/assets/img/oldschool/${color}_schere.gif`,
    },
    TRAP: {
        name: 'trap',
        src: (color) => `/assets/img/oldschool/${color}_falle.gif`
    },
    FLAG: {
        name: 'flag',
        src: (color) => `/assets/img/oldschool/${color}_flagge.gif`
    },
    HIDDEN: {
        name: 'flag',
        src: (color) => `/assets/img/oldschool/${color}_frage.gif`
    },
    FIGHT: {
        name: 'fight',
        src: () => `/assets/img/oldschool/kampf.gif`
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
