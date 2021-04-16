package info.seltenheim.ssponline.gamestate;

import info.seltenheim.ssponline.game.model.*;
import info.seltenheim.ssponline.gamestate.model.Fight;
import info.seltenheim.ssponline.gamestate.model.GameState;
import info.seltenheim.ssponline.gamestate.model.Unit;
import info.seltenheim.ssponline.gamestate.repository.FightRepository;
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
    private final FightRepository fightRepository;
    private final UnitService unitService;

    public GameState processAction(GameAction action) {
        GameState gameState = null;
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
            case MOVE:
                gameState = processMove((GameActionMove) action);
                break;
            case FIGHT:
                gameState = processFight((GameActionFight) action);
                break;
            case START:
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

        if(action.getTeam() == Team.RED) {
            gameState.setRedAcceptedUnits(true);
        } else {
            gameState.setBlueAcceptedUnits(true);
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
//        final var unitFrom = unitService.findUnitInLocation(gameId, from)
//                .orElseThrow();
//        final var unitToOptional = unitService.findUnitInLocation(gameId, to);


        // normal move
//        if (unitToOptional.isEmpty()) {
//        unitService.updateUnitPosition(unitFrom.getId(), to);
//            toggleTeamsTurn(gameState);
//        return gameState;
//        }

//        // fight state
//
//        final var unitTo = unitToOptional.get();
//        final var fightResult = unitService.fightAfterMove(unitFrom, unitTo);
//
//        if (fightResult != UnitService.FightResult.TIE) {
//            toggleTeamsTurn(game);
//        } else {
//            enterTieMode(game, to);
//        }
//
//        return game;
    }

    private GameState processFight(GameActionFight action) {
        if (action.getWinningTeam() != null) {
            final var winningUnit = action.getWinningTeam() == Team.RED ? action.getRedType() : action.getBlueType();
            unitService.creatNewUnit(action.getGameId(), action.getWinningTeam(), winningUnit, action.getLocation(), true);
        }

        return gameRepository.findById(action.getGameId()).orElseThrow();
    }

    public Optional<Unit> findUnitInLocation(@NonNull String gameId, @NonNull Point location) {
        return unitService.findUnitInLocation(gameId, location);
    }


    public GameState moveUnit(@NonNull String gameId, @NonNull Point from, @NonNull Point to) {
        final var game = gameRepository.findById(gameId)
                .orElseThrow();
        final var unitFrom = unitService.findUnitInLocation(gameId, from)
                .orElseThrow();
        final var unitToOptional = unitService.findUnitInLocation(gameId, to);

        if (unitToOptional.isEmpty()) {
            unitService.updateUnitPosition(unitFrom.getId(), to);
            toggleTeamsTurn(game);
            return game;
        }

        final var unitTo = unitToOptional.get();
        final var fightResult = unitService.fightAfterMove(unitFrom, unitTo);

        if (fightResult != UnitService.FightResult.TIE) {
            toggleTeamsTurn(game);
        } else {
            enterTieMode(game, to);
        }

        return game;
    }

    public void chooseUnitForFight(@NonNull String gameId, @NonNull Team team, @NonNull UnitType type) {
        final var game = gameRepository.findById(gameId).orElseThrow();
        final var fight = fightRepository.findById(gameId).orElseThrow();
        final var choice = fight.getChoiceForTeam(team);
        if (choice != null) {
            return;
        }

        fight.setChoiceForTeam(team, type);
        if (fight.isBothUnitsSet()) {
            final var fightResult = unitService.fight(fight.getRedChoice(), fight.getBlueChoice());

            switch (fightResult) {
                case ATTACKER_WINS:
                    unitService.creatNewUnit(gameId, Team.RED, fight.getRedChoice(), fight.getLocation(), true);
                    fightRepository.delete(fight);
                    game.setGameState(info.seltenheim.ssponline.game.model.GameState.TURN);
                    final var nextTeam = game.getActiveTeam() == Team.RED ? Team.BLUE : Team.RED;
                    game.setActiveTeam(nextTeam);
                    gameRepository.save(game);
                    break;
                case DEFENDER_WINS:
                    unitService.creatNewUnit(gameId, Team.BLUE, fight.getBlueChoice(), fight.getLocation(), true);
                    fightRepository.delete(fight);
                    game.setGameState(info.seltenheim.ssponline.game.model.GameState.TURN);
                    final var nextTeam2 = game.getActiveTeam() == Team.RED ? Team.BLUE : Team.RED;
                    game.setActiveTeam(nextTeam2);
                    gameRepository.save(game);
                    break;
                case TIE:
                    fight.setRedChoice(null);
                    fight.setBlueChoice(null);
                    fightRepository.save(fight);
                    break;
            }
        }
    }

    public Fight getFightForGame(String gameId) {
        return fightRepository.findById(gameId).orElseThrow();
    }

    private void toggleTeamsTurn(GameState game) {
        final var nextTeam = game.getActiveTeam() == Team.RED ? Team.BLUE : Team.RED;
        game.setActiveTeam(nextTeam);
    }

    private void enterTieMode(GameState game, Point location) {
        game.setGameState(info.seltenheim.ssponline.game.model.GameState.FIGHT);
        fightRepository.save(new Fight(game.getId(), location));

        gameRepository.save(game);
    }
}
