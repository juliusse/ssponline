import {GameState, Team, UnitType} from "../constants/Constants";
import {UnitModel} from "./UnitModel";


export class GameStateModel {
    constructor({playerTeam}) {
        this.gameId = null;
        this.playerTeam = playerTeam;
        this.lastProcessedAction = -1;
        this.activeTeam = null;
        this.gameState = null;
        this.board = null;
        this.fightLocation = null;
        this.fightChoice = null;
    }

    processActions({actions}) {
        actions.forEach(action => {
            if (action.actionId > this.lastProcessedAction) {
                this.processAction(action);
            }
        });

        return this;
    }

    processAction(action) {
        if (action.actionType === 'CONFIGURE') {
            this.processActionConfigure(action);
        } else if (action.actionType === 'SHUFFLE_UNITS') {
            this.processActionShuffleUnits(action);
        } else if (action.actionType === 'ACCEPT_UNITS') {
            this.processActionAcceptUnits(action);
        } else if (action.actionType === 'START') {
            this.processActionGameStart(action);
        } else if (action.actionType === 'MOVE') {
            this.processActionMove(action);
        } else if (action.actionType === 'FIGHT') {
            this.processActionFight(action);
        } else if (action.actionType === 'FIGHT_CHOOSE_UNIT') {
            this.processActionFightChooseUnit(action);
        }

        this.activeTeam = Team[action.activeTeam];
        this.gameState = GameState[action.gameState];
        this.lastProcessedAction = action.actionId;
    }

    processActionConfigure(configureAction) {
        this.gameId = configureAction.gameId;
        const board = [];
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);

        this.board = board;
    }

    processActionShuffleUnits(shuffleUnitsAction) {
        const board = this.board;
        shuffleUnitsAction
            .units
            .forEach(unit => {
                const team = Team[unit.team];
                const type = UnitType[unit.type];
                const visible = UnitType[unit.visible];
                board[unit.location.y][unit.location.x] = new UnitModel({team, type, visible});
            });
    }

    processActionAcceptUnits(acceptTurnAction) {
        // todo
    }

    processActionGameStart(gameStartAction) {
        // todo
    }

    processActionMove(moveAction) {
        const board = this.board;
        const unit = board[moveAction.from.y][moveAction.from.x];

        board[moveAction.from.y][moveAction.from.x] = null;
        board[moveAction.to.y][moveAction.to.x] = unit;
    }

    processActionFight(fightAction) {
        const board = this.board;

        if (fightAction.winningTeam != null) {
            const winningTeam = Team[fightAction.winningTeam];
            const winningUnit = fightAction.winningTeam === 'RED' ? fightAction.redType : fightAction.blueType;
            board[fightAction.location.y][fightAction.location.x] =
                new UnitModel({team: winningTeam, type: UnitType[winningUnit], visible: true});
        } else {
            board[fightAction.location.y][fightAction.location.x] =
                new UnitModel({type: UnitType.FIGHT});
        }

        this.fightChoice = null;
    }

    processActionFightChooseUnit(chooseAction) {
        const team = Team[chooseAction.team];
        if (team !== this.playerTeam) {
            return;
        }

        this.fightChoice = UnitType[chooseAction.type];
    }
}
