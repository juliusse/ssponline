package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.configuration.OffsetLimitPageable;
import info.seltenheim.ssponline.game.dto.action.request.GameActionFightChooseUnitRequestDTO;
import info.seltenheim.ssponline.game.dto.action.request.GameActionMoveRequestDTO;
import info.seltenheim.ssponline.game.dto.action.request.GameActionRequestDTO;
import info.seltenheim.ssponline.game.model.*;
import info.seltenheim.ssponline.game.repository.GameActionRepository;
import info.seltenheim.ssponline.game.repository.GameActionUnitRepository;
import info.seltenheim.ssponline.game.repository.GameRepository;
import info.seltenheim.ssponline.gamestate.GameStateService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
@Transactional
public class GameService {
    private final GameRepository gameRepository;
    private final GameActionRepository gameActionRepository;
    private final GameActionUnitRepository gameActionUnitRepository;
    private final GameStateService gameStateService;

    public Game getGame(@NonNull String id) {
        return gameRepository
                .findById(id)
                .orElseGet(() -> createNewGame(id));
    }

    public List<GameAction> getGameActions(@NonNull String id) {
        return gameActionRepository.findAllByGameIdOrderByActionIdAsc(id, new OffsetLimitPageable(0, 10000));
    }

    public List<GameAction> getGameActions(@NonNull String id, @NonNull int fromIndex) {
        return gameActionRepository.findAllByGameIdOrderByActionIdAsc(id, new OffsetLimitPageable(fromIndex, 10000));
    }


    public Game createNewGame(@NonNull String id) {
        log.info("Creating new Game with id '{}'", id);


        final var game = gameRepository.save(new Game(id));
        gameStateService.processAction(
                gameActionRepository.save(new GameActionConfigure(id, 0L))
        );

        createShuffleAction(id, 1L, Team.RED);
        createShuffleAction(id, 2L, Team.BLUE);
        gameStateService.processAction(
                gameActionRepository.save(new GameActionAcceptUnits(id, 3L, Team.RED))
        );
        gameStateService.processAction(
                gameActionRepository.save(new GameActionAcceptUnits(id, 4L, Team.BLUE))
        );
        gameStateService.processAction(
                gameActionRepository.save(new GameActionStart(id, 5L, Team.RED))
        );

        return game;
    }

//    public Game moveUnit(@NonNull String gameId, @NonNull Point from, @NonNull Point to) {
//        final var game = gameRepository.findById(gameId)
//                .orElseThrow();
//        final var unitFrom = unitService.findUnitInLocation(gameId, from)
//                .orElseThrow();
//        final var unitToOptional = unitService.findUnitInLocation(gameId, to);
//
//        if (unitToOptional.isEmpty()) {
//            unitService.updateUnitPosition(unitFrom.getId(), to);
//            toggleTeamsTurn(game);
//            return game;
//        }
//
//        final var unitTo = unitToOptional.get();
//        final var fightResult = unitService.fightAfterMove(unitFrom, unitTo);
//
//        if (fightResult != FightResult.TIE) {
//            toggleTeamsTurn(game);
//        } else {
//            enterTieMode(game, to);
//        }
//
//        return game;
//    }

//    public void chooseUnitForFight(@NonNull String gameId, @NonNull Team team, @NonNull UnitType type) {
//        final var game = gameRepository.findById(gameId).orElseThrow();
//        final var fight = fightRepository.findById(gameId).orElseThrow();
//        final var choice = fight.getChoiceForTeam(team);
//        if (choice != null) {
//            return;
//        }
//
//        fight.setChoiceForTeam(team, type);
//        if (fight.isBothUnitsSet()) {
//            final var fightResult = unitService.fight(fight.getRedChoice(), fight.getBlueChoice());
//
//            switch (fightResult) {
//                case ATTACKER_WINS:
//                    unitService.creatNewUnit(gameId, Team.RED, fight.getRedChoice(), fight.getLocation(), true);
//                    fightRepository.delete(fight);
//                    game.setGameState(GameState.TURN);
//                    final var nextTeam = game.getActiveTeam() == Team.RED ? Team.BLUE : Team.RED;
//                    game.setActiveTeam(nextTeam);
//                    gameRepository.save(game);
//                    break;
//                case DEFENDER_WINS:
//                    unitService.creatNewUnit(gameId, Team.BLUE, fight.getBlueChoice(), fight.getLocation(), true);
//                    fightRepository.delete(fight);
//                    game.setGameState(GameState.TURN);
//                    final var nextTeam2 = game.getActiveTeam() == Team.RED ? Team.BLUE : Team.RED;
//                    game.setActiveTeam(nextTeam2);
//                    gameRepository.save(game);
//                    break;
//                case TIE:
//                    fight.setRedChoice(null);
//                    fight.setBlueChoice(null);
//                    fightRepository.save(fight);
//                    break;
//            }
//        }
//    }

//    public Fight getFightForGame(String gameId) {
//        return fightRepository.findById(gameId).orElseThrow();
//    }

//    private void toggleTeamsTurn(Game game) {
//        final var nextTeam = game.getActiveTeam() == Team.RED ? Team.BLUE : Team.RED;
//        game.setActiveTeam(nextTeam);
//        gameRepository.updateActiveTeam(game.getId(), nextTeam);
//    }
//
//    private void enterTieMode(Game game, Point location) {
//        game.setGameState(GameState.FIGHT);
//        fightRepository.save(new Fight(game.getId(), location));
//
//        gameRepository.save(game);
//    }

    private void createShuffleAction(String gameId, Long actionId, Team team) {
        final var action = gameActionRepository.save(new GameActionShuffleUnits(gameId, actionId, team));

        final var allowedFigures = new UnitType[]{UnitType.ROCK, UnitType.PAPER, UnitType.SCISSORS};

        final int startY = team == Team.RED ? 0 : 4;

        final var units = new ArrayList<GameActionUnit>();
        for (int y = 0; y < 2; y++) {
            for (int x = 0; x < 7; x++) {
                final var type = allowedFigures[(int) (Math.random() * 3)];
                final var unit = new GameActionUnit(action, x, y + startY, team, type, false);
                gameActionUnitRepository.save(unit);
                units.add(unit);
            }
        }

        action.setUnits(units);
        gameStateService.processAction(action);
    }

    public void processAction(String gameId, Team team, GameActionRequestDTO request) {
        if (request instanceof GameActionMoveRequestDTO) {
            processActionMove(gameId, team, (GameActionMoveRequestDTO) request);
        } else if (request instanceof GameActionFightChooseUnitRequestDTO) {
            processActionFightChooseUnit(gameId, team, (GameActionFightChooseUnitRequestDTO) request);
        }
    }

    private void processActionMove(String gameId, Team team, GameActionMoveRequestDTO request) {
        final var lastAction = gameActionRepository.findFirstByGameIdOrderByActionIdDesc(gameId);
        if (lastAction.getActiveTeam() != team) {
            throw new IllegalStateException();
        }

        final var unitFrom = gameStateService.findUnitInLocation(gameId, request.getFrom()).orElseThrow();
        final var unitToOptional = gameStateService.findUnitInLocation(gameId, request.getTo());

        final var nextState = unitToOptional.isEmpty() ? GameState.TURN : GameState.FIGHT;

        final var action = new GameActionMove(
                gameId,
                lastAction.getActionId() + 1,
                getOtherTeam(team),
                nextState,
                request.getFrom(),
                request.getTo());
        gameActionRepository.save(action);
        gameStateService.processAction(action);


        // fight
        if (nextState == GameState.FIGHT) {
            final var unitTo = unitToOptional.get();
            final var redUnit = unitFrom.getTeam() == Team.RED ? unitFrom.getType() : unitTo.getType();
            final var blueUnit = unitFrom.getTeam() == Team.BLUE ? unitFrom.getType() : unitTo.getType();

            fight(gameId, lastAction.getActionId() + 2, action.getActiveTeam(), unitTo.getLocation(), redUnit, blueUnit);
        }
    }

    private void processActionFightChooseUnit(String gameId, Team team, GameActionFightChooseUnitRequestDTO request) {
        final var game = gameRepository.findById(gameId).orElseThrow();
        final var lastAction = gameActionRepository.findFirstByGameIdOrderByActionIdDesc(gameId);

        if (lastAction instanceof GameActionFightChooseUnit && ((GameActionFightChooseUnit) lastAction).getTeam() == team) {
            return;
        }

        final var unitType = UnitType.valueOf(request.getUnitType().name());
        final var action = new GameActionFightChooseUnit(gameId,
                lastAction.getActionId() + 1,
                lastAction.getActiveTeam(),
                team,
                unitType);

        gameActionRepository.save(action);

        if (lastAction instanceof GameActionFight) {
            return; // waiting for choice of other player
        }

        final var fightAction = (GameActionFight) gameActionRepository.findFirstByGameIdAndActionTypeOrderByActionIdDesc(gameId, GameActionType.FIGHT);
        final var redType = team == Team.RED ? action.getType() : ((GameActionFightChooseUnit) lastAction).getType();
        final var blueType = team == Team.BLUE ? action.getType() : ((GameActionFightChooseUnit) lastAction).getType();

        fight(gameId, lastAction.getActionId() + 2, action.getActiveTeam(), fightAction.getLocation(), redType, blueType);
    }

    private void fight(String gameId, long actionId, Team activeTeam, Point location, UnitType redType, UnitType blueType) {
        final var winner = fight(redType, blueType);

        if (winner == FightResult.TIE) {
            final var fightAction = new GameActionFight(
                    gameId,
                    actionId,
                    activeTeam,
                    GameState.FIGHT,
                    location,
                    redType,
                    blueType,
                    null);
            gameActionRepository.save(fightAction);
            gameStateService.processAction(fightAction);
            return;
        }

        final var winningTeam = winner == FightResult.RED_WINS ? Team.RED : Team.BLUE;
        final var fightAction = new GameActionFight(
                gameId,
                actionId,
                activeTeam,
                GameState.TURN,
                location,
                redType,
                blueType,
                winningTeam);
        gameActionRepository.save(fightAction);
        gameStateService.processAction(fightAction);
    }

    private Team getOtherTeam(Team team) {
        return team == Team.RED ? Team.BLUE : Team.RED;
    }

    public FightResult fight(UnitType redType, UnitType blueType) {
        if (redType == blueType) {
            return FightResult.TIE;
        } else if (blueType == UnitType.FLAG) {
            return FightResult.RED_WINS;
        } else if (blueType == UnitType.TRAP) {
            return FightResult.BLUE_WINS;
        } else if ((redType == UnitType.ROCK && blueType == UnitType.SCISSORS)
                || (redType == UnitType.SCISSORS && blueType == UnitType.PAPER)
                || (redType == UnitType.PAPER && blueType == UnitType.ROCK)) {
            return FightResult.RED_WINS;
        } else {
            return FightResult.BLUE_WINS;
        }
    }

    public enum FightResult {
        RED_WINS, BLUE_WINS, TIE
    }
}
