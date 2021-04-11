export const Team = {
    RED: {
        imgColor: 'r'
    },
    BLUE: {
        imgColor: 'b'
    }
}

export const GameState = {
    SELECT_UNIT: 'SELECT_UNIT',
    MOVE_UNIT: 'MOVE_UNIT'
}

export const UnitType = {
    ROCK: {
        name: 'rock',
        src: (color) => `./src/assets/oldschool/${color}_stein.gif`
    },
    PAPER: {
        name: 'paper',
        src: (color) => `./src/assets/oldschool/${color}_schere.gif`
    },
    SCISSORS: {
        name: 'scissors',
        src: (color) => `./src/assets/oldschool/${color}_papier.gif`
    },
    TRAP: {
        name: 'trap',
        src: (color) => `./src/assets/oldschool/${color}_falle.gif`
    },
    FLAG: {
        name: 'flag',
        src: (color) => `./src/assets/oldschool/${color}_flagge.gif`
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
