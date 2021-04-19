package info.seltenheim.ssponline.gamestate;

import info.seltenheim.ssponline.game.model.*;
import info.seltenheim.ssponline.gamestate.model.GameState;
import info.seltenheim.ssponline.gamestate.model.Unit;
import info.seltenheim.ssponline.gamestate.repository.GameStateRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@Slf4j
@RequiredArgsConstructor
@Transactional
public class GameStateService {
    private final GameStateRepository gameRepository;
    private final UnitService unitService;

    public GameState processAction(GameAction action) {
        GameState gameState;
        switch (action.getActionType()) {
            case CONFIGURE:
                gameState = processConfigure((GameActionConfigure) action);
                break;
            case SHUFFLE_UNITS:
                gameState = processShuffleUnits((GameActionShuffleUnits) action);
                break;
            case ACCEPT_UNITS:
                gameState = processAcceptUnits((GameActionAcceptUnits) action);
                break;
            case SET_SPECIAL_UNITS:
                gameState = processSetSpecialUnits((GameActionSetSpecialUnits) action);
                break;
            case MOVE:
                gameState = processMove((GameActionMove) action);
                break;
            case FIGHT:
                gameState = processFight((GameActionFight) action);
                break;
            case WIN:
                gameState = processWin((GameActionWin) action);
                break;
            case START:
            case FIGHT_CHOOSE_UNIT:
            default:
                gameState = gameRepository.findById(action.getGameId()).orElseThrow();
        }

        gameState.setLastActionId(action.getActionId())
                .setActiveTeam(action.getActiveTeam())
                .setGameState(action.getGameState());

        return gameRepository.save(gameState);
    }

    private GameState processConfigure(GameActionConfigure gameActionConfigure) {
        final var gameState = new GameState(gameActionConfigure.getGameId());
        return gameRepository.save(gameState);
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
}
