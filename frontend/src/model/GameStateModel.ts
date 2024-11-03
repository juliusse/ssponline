import { GameState, UnitType } from "@/constants/Constants";
import { UnitModel } from "./UnitModel";
import { Point } from "./Point";
import { GameAction } from "./gameaction/GameAction";
import { Ensure } from "@/utils/Ensure";
import Team from "@/model/Team";


export class GameStateModel {
  readonly playerTeam: Team;
  gameId: string | null;
  actions: Array<GameAction>;
  lastProcessedAction: number;
  activeTeam: Team | null;
  gameState: GameState | null;
  board: Array<Array<UnitModel | null>> | null;
  acceptedUnits: boolean;
  acceptedSpecialUnits: boolean;
  fightLocation: Point | null;
  fightChoice: UnitType | null;

  constructor(playerTeam: Team) {
    this.playerTeam = playerTeam;
    this.gameId = null;
    this.actions = [];
    this.lastProcessedAction = -1;
    this.activeTeam = null;
    this.gameState = null;
    this.board = null;
    this.acceptedUnits = false;
    this.acceptedSpecialUnits = false;
    this.fightLocation = null;
    this.fightChoice = null;
  }

  static copy = (gameState: GameStateModel) => {
    const copy = new GameStateModel(gameState.playerTeam);
    copy.gameId = gameState.gameId;
    copy.actions = gameState.actions.slice();
    copy.lastProcessedAction = gameState.lastProcessedAction;
    copy.activeTeam = gameState.activeTeam;
    copy.gameState = gameState.gameState;
    copy.board = gameState.board?.map(row => row.map(unit => unit ? new UnitModel(unit.team, unit.type, unit.visible) : null)) || null;
    copy.acceptedUnits = gameState.acceptedUnits;
    copy.acceptedSpecialUnits = gameState.acceptedSpecialUnits;
    copy.fightLocation = gameState.fightLocation ? new Point(gameState.fightLocation.x, gameState.fightLocation.y) : null;
    copy.fightChoice = gameState.fightChoice;
    return copy;
  }


  getLastAction() {
    return this.actions.length > 0 ? this.actions[this.actions.length - 1] : null;
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
    if (action.actionType === "CONFIGURE") {
      this.processActionConfigure(action);
    } else if (action.actionType === "SHUFFLE_UNITS") {
      this.processActionShuffleUnits(action);
    } else if (action.actionType === "ACCEPT_UNITS") {
      this.processActionAcceptUnits(action);
    } else if (action.actionType === "SET_SPECIAL_UNITS") {
      this.processActionSetSpecialUnits(action);
    } else if (action.actionType === "START") {
      this.processActionGameStart(action);
    } else if (action.actionType === "MOVE") {
      this.processActionMove(action);
    } else if (action.actionType === "FIGHT") {
      this.processActionFight(action);
    } else if (action.actionType === "FIGHT_CHOOSE_UNIT") {
      this.processActionFightChooseUnit(action);
    }

    this.activeTeam = action.activeTeam;
    this.gameState = action.gameState;
    this.lastProcessedAction = action.actionId;

    this.actions.push(action);
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
    Ensure.isNotNull(this.board, "board");
    Ensure.isNotNull(shuffleUnitsAction.units, "shuffleUnitsAction.units");

    const board = this.board;
    shuffleUnitsAction
      .units!
      .forEach(unit => {
        const team = unit.team;
        const type = unit.type;
        const visible = unit.visible;
        board![unit.location.y][unit.location.x] = new UnitModel(team, type, visible);
      });
  }

  processActionAcceptUnits(acceptTurnAction: GameAction) {
    const team = acceptTurnAction.team;

    if (team === this.playerTeam) {
      this.acceptedUnits = true;
    }
  }

  processActionSetSpecialUnits(setSpecialUnitsAction: GameAction) {
    Ensure.isNotNull(this.board, "board");
    Ensure.isNotNull(setSpecialUnitsAction.units, "setSpecialUnitsAction.units");

    const board = this.board;
    setSpecialUnitsAction
      .units!
      .forEach(unit => {
        const team = unit.team;
        const type = unit.type;
        const visible = unit.visible;
        board![unit.location.y][unit.location.x] = new UnitModel(team, type, visible);
      });

    if (setSpecialUnitsAction.team! === this.playerTeam) {
      this.acceptedSpecialUnits = true;
    }
  }

  // @ts-expect-error will be later implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  processActionGameStart(gameStartAction: GameAction) {
    // todo
  }

  processActionMove(moveAction: GameAction) {
    Ensure.isNotNull(this.board, "board");
    const board = this.board;
    const unit = board![moveAction.from!.y][moveAction.from!.x];

    board![moveAction.from!.y][moveAction.from!.x] = null;
    board![moveAction.to!.y][moveAction.to!.x] = unit;
  }

  processActionFight(fightAction: GameAction) {
    Ensure.isNotNull(this.board, "board");

    const board = this.board;

    if (fightAction.winningTeam != null) {
      const winningTeam = fightAction.winningTeam;
      const winningUnit = winningTeam === Team.RED ? fightAction.redType : fightAction.blueType;
      board![fightAction.location!.y][fightAction.location!.x] =
        new UnitModel(winningTeam, winningUnit!, true);
      this.fightLocation = null;
    } else {
      this.fightLocation = new Point(fightAction.location!.x, fightAction.location!.y);
    }

    this.fightChoice = null;
  }

  processActionFightChooseUnit(chooseAction: GameAction) {
    const team = chooseAction.team!;
    if (team !== this.playerTeam) {
      return;
    }

    this.fightChoice = chooseAction.type;
  }
}
