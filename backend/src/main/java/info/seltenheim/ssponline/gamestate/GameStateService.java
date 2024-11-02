package info.seltenheim.ssponline.gamestate;

import info.seltenheim.ssponline.game.model.*;
import info.seltenheim.ssponline.gamestate.model.GameState;
import info.seltenheim.ssponline.gamestate.model.Unit;
import info.seltenheim.ssponline.gamestate.repository.GameStateRepository;
import java.util.Optional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Slf4j
@RequiredArgsConstructor
@Transactional
public class GameStateService {
  private final GameStateRepository gameRepository;
  private final UnitService unitService;

  public GameState processAction(GameAction action) {
    final var gameState = switch (action.getActionType()) {
      case CONFIGURE -> processConfigure((GameActionConfigure) action);
      case SHUFFLE_UNITS -> processShuffleUnits((GameActionShuffleUnits) action);
      case ACCEPT_UNITS -> processAcceptUnits((GameActionAcceptUnits) action);
      case SET_SPECIAL_UNITS -> processSetSpecialUnits((GameActionSetSpecialUnits) action);
      case MOVE -> processMove((GameActionMove) action);
      case FIGHT -> processFight((GameActionFight) action);
      case WIN -> processWin((GameActionWin) action);
      case START, FIGHT_CHOOSE_UNIT -> gameRepository.findById(action.getGameId()).orElseThrow();
    };

    gameState.setLastActionId(action.getActionId())
      .setActiveTeam(action.getActiveTeam())
      .setGameState(action.getGameState());

    return gameRepository.save(gameState);
  }

  private GameState processConfigure(GameActionConfigure gameActionConfigure) {
    final var gameState = new GameState(gameActionConfigure.getGameId());
    return gameState;
  }

  private GameState processShuffleUnits(GameActionShuffleUnits action) {
    final var gameState = gameRepository.findById(action.getGameId()).orElseThrow();
    unitService.createUnitsForTeam(gameState.getId(), action.getTeam(), action.getUnits());

    return gameState;
  }

  private GameState processAcceptUnits(GameActionAcceptUnits action) {
    final var gameState = gameRepository.findById(action.getGameId()).orElseThrow();

    if (action.getTeam() == Team.RED) {
      gameState.setRedAcceptedUnits(true);
    } else {
      gameState.setBlueAcceptedUnits(true);
    }

    return gameState;
  }

  private GameState processSetSpecialUnits(GameActionSetSpecialUnits action) {
    final var gameState = gameRepository.findById(action.getGameId()).orElseThrow();

    action.getUnits()
      .stream()
      .forEach(unit -> unitService.replaceUnitAtPosition(action.getGameId(), unit));


    if (action.getTeam() == Team.RED) {
      gameState.setRedSetSpecialUnits(true);
    } else {
      gameState.setBlueSetSpecialUnits(true);
    }

    return gameState;
  }

  private GameState processMove(GameActionMove action) {
    final var gameId = action.getGameId();
    final var from = action.getFrom();
    final var to = action.getTo();

    switch (action.getGameState()) {
      case TURN:
        unitService.moveUnit(gameId, from, to);
        break;
      case FIGHT:
        unitService.deleteUnitAtLocation(gameId, from);
        unitService.deleteUnitAtLocation(gameId, to);
        break;
    }
    return gameRepository.findById(gameId).orElseThrow();
  }

  private GameState processFight(GameActionFight action) {
    if (action.getWinningTeam() != null) {
      final var winningUnit = action.getWinningTeam() == Team.RED ? action.getRedType() : action.getBlueType();
      unitService.creatNewUnit(action.getGameId(), action.getWinningTeam(), winningUnit, action.getLocation(), true);
    }

    return gameRepository.findById(action.getGameId()).orElseThrow();
  }

  private GameState processWin(GameActionWin action) {
    final var gameState = gameRepository.findById(action.getGameId()).orElseThrow();

    gameState.setGameState(info.seltenheim.ssponline.game.model.GameState.ENDED);
    return gameState;
  }

  public Optional<Unit> findUnitInLocation(@NonNull String gameId, @NonNull Point location) {
    return unitService.findUnitInLocation(gameId, location);
  }

  public boolean hasTeamStillUnits(String gameId, Team team) {
    return unitService.getUnitsForGame(gameId)
      .stream()
      .filter(unit -> unit.getTeam() == team)
      .anyMatch(unit ->
        unit.getType() == UnitType.ROCK ||
          unit.getType() == UnitType.PAPER ||
          unit.getType() == UnitType.SCISSORS);
  }
}
