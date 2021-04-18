import {GameState, UnitType} from "../constants/Constants";
import {UnitModel} from "./UnitModel";
import {Team} from "./Team";
import {Point} from "./Point";
import {GameAction} from "./gameaction/GameAction";
import {Ensure} from "../utils/Ensure";


export class GameStateModel {
    readonly playerTeam: Team;
    gameId: string | null;
    lastProcessedAction: number;
    activeTeam: Team | null;
    gameState: GameState | null;
    board: Array<Array<UnitModel | null>> | null;
    acceptedUnits: boolean;
    acceptedSpecialUnits: boolean;
    fightLocation: Point | null;
    fightChoice: UnitType | null;

    constructor(playerTeam: Team) {
        this.gameId = null;
        this.playerTeam = playerTeam;
        this.lastProcessedAction = -1;
        this.activeTeam = null;
        this.gameState = null;
        this.board = null;
        this.acceptedUnits = false;
        this.acceptedSpecialUnits = false;
        this.fightLocation = null;
        this.fightChoice = null;
    }

    processActions(actions: Array<GameAction>) {
        actions.forEach(action => {
            if (action.actionId > this.lastProcessedAction) {
                this.processAction(action);
            }
        });

        return this;
    }

    processAction(action: GameAction) {
        if (action.actionType === 'CONFIGURE') {
            this.processActionConfigure(action);
        } else if (action.actionType === 'SHUFFLE_UNITS') {
            this.processActionShuffleUnits(action);
        } else if (action.actionType === 'ACCEPT_UNITS') {
            this.processActionAcceptUnits(action);
        } else if (action.actionType === 'SET_SPECIAL_UNITS') {
            this.processActionSetSpecialUnits(action);
        } else if (action.actionType === 'START') {
            this.processActionGameStart(action);
        } else if (action.actionType === 'MOVE') {
            this.processActionMove(action);
        } else if (action.actionType === 'FIGHT') {
            this.processActionFight(action);
        } else if (action.actionType === 'FIGHT_CHOOSE_UNIT') {
            this.processActionFightChooseUnit(action);
        }

        this.activeTeam = action.activeTeam ? Team.getForColor(action.activeTeam) : null;
        this.gameState = GameState[action.gameState as keyof typeof GameState];
        this.lastProcessedAction = action.actionId;
    }

    processActionConfigure(configureAction: GameAction) {
        this.gameId = configureAction.gameId;
        const board = new Array<Array<UnitModel | null>>();
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);
        board.push([null, null, null, null, null, null, null]);

        this.board = board;
    }

    processActionShuffleUnits(shuffleUnitsAction: GameAction) {
        Ensure.isNotNull(this.board, 'board');
        Ensure.isNotNull(shuffleUnitsAction.units, 'shuffleUnitsAction.units');

        const board = this.board;
        shuffleUnitsAction
            .units!
            .forEach(unit => {
                const team = Team.getForColor(unit.team);
                const type = UnitType[unit.type as keyof typeof UnitType];
                const visible = unit.visible;
                board![unit.location.y][unit.location.x] = new UnitModel(team, type, visible);
            });
    }

    processActionAcceptUnits(acceptTurnAction: GameAction) {
        const team = Team.getForColor(acceptTurnAction.team!);

        if (team === this.playerTeam) {
            this.acceptedUnits = true;
        }
    }

    processActionSetSpecialUnits(setSpecialUnitsAction: GameAction) {
        Ensure.isNotNull(this.board, 'board');
        Ensure.isNotNull(setSpecialUnitsAction.units, 'setSpecialUnitsAction.units');

        const board = this.board;
        setSpecialUnitsAction
            .units!
            .forEach(unit => {
                const team = Team.getForColor(unit.team);
                const type = UnitType[unit.type as keyof typeof UnitType];
                const visible = unit.visible;
                board![unit.location.y][unit.location.x] = new UnitModel(team, type, visible);
            });

        if (Team.getForColor(setSpecialUnitsAction.team!) === this.playerTeam) {
            this.acceptedSpecialUnits = true;
        }
    }

    processActionGameStart(gameStartAction: GameAction) {
        // todo
    }

    processActionMove(moveAction: GameAction) {
        Ensure.isNotNull(this.board, 'board');
        const board = this.board;
        const unit = board![moveAction.from!.y][moveAction.from!.x];

        board![moveAction.from!.y][moveAction.from!.x] = null;
        board![moveAction.to!.y][moveAction.to!.x] = unit;
    }

    processActionFight(fightAction: GameAction) {
        Ensure.isNotNull(this.board, 'board');

        const board = this.board;

        if (fightAction.winningTeam != null) {
            const winningTeam = Team.getForColor(fightAction.winningTeam);
            const winningUnit = winningTeam === Team.RED ? fightAction.redType : fightAction.blueType;
            board![fightAction.location!.y][fightAction.location!.x] =
                new UnitModel(winningTeam, UnitType[winningUnit! as keyof typeof UnitType], true);
            this.fightLocation = null;
        } else {
            this.fightLocation = new Point(fightAction.location.x, fightAction.location.y);
        }

        this.fightChoice = null;
    }

    processActionFightChooseUnit(chooseAction: GameAction) {
        const team = Team.getForColor(chooseAction.team!);
        if (team !== this.playerTeam) {
            return;
        }

        this.fightChoice = UnitType[chooseAction.type! as keyof typeof UnitType];
    }
}
