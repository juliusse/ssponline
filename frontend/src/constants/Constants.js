export const Team = {
    RED: {
        name: 'red',
        imgColor: 'r',
        color: 'red'
    },
    BLUE: {
        name: 'blue',
        imgColor: 'b',
        color: 'blue'
    }
}

export const GameState = {
    SELECT_UNIT: 'SELECT_UNIT',
    MOVE_UNIT: 'MOVE_UNIT'
}

export const UnitType = {
    ROCK: {
        name: 'rock',
        src: (color) => `./src/assets/oldschool/${color}_stein.gif`,
    },
    PAPER: {
        name: 'paper',
        src: (color) => `./src/assets/oldschool/${color}_papier.gif`,
    },
    SCISSORS: {
        name: 'scissors',
        src: (color) => `./src/assets/oldschool/${color}_schere.gif`,
    },
    TRAP: {
        name: 'trap',
        src: (color) => `./src/assets/oldschool/${color}_falle.gif`
    },
    FLAG: {
        name: 'flag',
        src: (color) => `./src/assets/oldschool/${color}_flagge.gif`
    },
    HIDDEN: {
        name: 'flag',
        src: (color) => `./src/assets/oldschool/${color}_frage.gif`
    },
};

export const Direction = {
    UP: {
        src: `./src/assets/oldschool/pfeil_o.gif`
    },
    DOWN: {
        src: `./src/assets/oldschool/pfeil_u.gif`
    },
    LEFT: {
        src: `./src/assets/oldschool/pfeil_l.gif`
    },
    RIGHT: {
        src: `./src/assets/oldschool/pfeil_r.gif`
    },
}
