package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.configuration.OffsetLimitPageable;
import info.seltenheim.ssponline.game.dto.action.request.*;
import info.seltenheim.ssponline.game.model.*;
import info.seltenheim.ssponline.game.repository.GameActionRepository;
import info.seltenheim.ssponline.game.repository.GameActionUnitRepository;
import info.seltenheim.ssponline.game.repository.GameRepository;
import info.seltenheim.ssponline.gamestate.GameStateService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Retryable;
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

    @Retryable
    public Game getGame(@NonNull String id) {
        return gameRepository
                .findById(id)
                .orElseGet(() -> createNewGame(id));
    }

    public List<GameAction> getGameActions(@NonNull String id, @NonNull int fromIndex) {
        return gameActionRepository.findAllByGameIdOrderByActionIdAsc(id, new OffsetLimitPageable(fromIndex, 10000));
    }

    public Game createNewGame(@NonNull String id) {
        log.info("Creating new Game with id '{}'", id);


        final var game = gameRepository.save(new Game(id));
        final var actionConfigure = gameActionRepository.save(new GameActionConfigure(id, 0L));
        gameStateService.processAction(actionConfigure);

        final var redShuffle =
                processShuffleUnitsAction(id, Team.RED, actionConfigure, new GameActionShuffleUnitsRequestDTO());
        processShuffleUnitsAction(id, Team.BLUE, redShuffle, new GameActionShuffleUnitsRequestDTO());

        return game;
    }

    public void processAction(String gameId, Team team, GameActionRequestDTO request) {
        final var lastAction = gameActionRepository.findFirstByGameIdOrderByActionIdDesc(gameId);

        if (request instanceof GameActionShuffleUnitsRequestDTO) {
            processShuffleUnitsAction(gameId, team, lastAction, (GameActionShuffleUnitsRequestDTO) request);
        } else if (request instanceof GameActionAcceptUnitsRequestDTO) {
            processAcceptUnitsAction(gameId, team, lastAction, (GameActionAcceptUnitsRequestDTO) request);
        } else if (request instanceof GameActionSetSpecialUnitsRequestDTO) {
            processActionSetSpecialUnits(gameId, team, lastAction, (GameActionSetSpecialUnitsRequestDTO) request);
        } else if (request instanceof GameActionMoveRequestDTO) {
            processActionMove(gameId, team, lastAction, (GameActionMoveRequestDTO) request);
        } else if (request instanceof GameActionFightChooseUnitRequestDTO) {
            processActionFightChooseUnit(gameId, team, lastAction, (GameActionFightChooseUnitRequestDTO) request);
        }
    }

    private GameActionShuffleUnits processShuffleUnitsAction(String gameId,
                                                             Team team,
                                                             GameAction lastAction,
                                                             GameActionShuffleUnitsRequestDTO request) {

        final var action = gameActionRepository.save(new GameActionShuffleUnits(gameId, lastAction.getActionId() + 1, team));

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

        return action;
    }

    private void processAcceptUnitsAction(String gameId, Team team, GameAction lastAction, GameActionAcceptUnitsRequestDTO request) {
        final var action = gameActionRepository.save(new GameActionAcceptUnits(gameId, lastAction.getActionId() + 1, team));
        final var gameState = gameStateService.processAction(action);

//        if (gameState.isRedAcceptedUnits() && gameState.isBlueAcceptedUnits()) {
//            final var redAcceptAction =
//                    processActionSetSpecialUnits(gameId, Team.RED, action, new GameActionSetSpecialUnitsRequestDTO()
//                            .setFlag(new Point(3, 0))
//                            .setTrap1(new Point(2, 1))
//                            .setTrap2(new Point(5, 1)));
//            processActionSetSpecialUnits(gameId, Team.BLUE, redAcceptAction, new GameActionSetSpecialUnitsRequestDTO()
//                    .setFlag(new Point(3, 5))
//                    .setTrap1(new Point(2, 4))
//                    .setTrap2(new Point(5, 4)));
//
//
//        }
    }

    private GameActionSetSpecialUnits processActionSetSpecialUnits(String gameId, Team team, GameAction lastAction, GameActionSetSpecialUnitsRequestDTO request) {
        final var action = gameActionRepository.save(new GameActionSetSpecialUnits(gameId, lastAction.getActionId() + 1, team));
        final var trap1 = request.getTrap1();
        final var trap2 = request.getTrap2();
        final var flag = request.getFlag();

        final var units = new ArrayList<GameActionUnit>();
        units.add(gameActionUnitRepository
                .save(new GameActionUnit(action, trap1.getX(), trap1.getY(), team, UnitType.TRAP, false)));
        units.add(gameActionUnitRepository
                .save(new GameActionUnit(action, trap2.getX(), trap2.getY(), team, UnitType.TRAP, false)));
        units.add(gameActionUnitRepository
                .save(new GameActionUnit(action, flag.getX(), flag.getY(), team, UnitType.FLAG, false)));

        action.setUnits(units);
        final var gameState = gameStateService.processAction(action);
        if (gameState.isRedSetSpecialUnits() && gameState.isBlueSetSpecialUnits()) {
            gameStateService.processAction(
                    gameActionRepository.save(new GameActionStart(gameId, lastAction.getActionId() + 2, Team.RED))
            );
        }
        return action;
    }

    private void processActionMove(String gameId, Team team, GameAction lastAction, GameActionMoveRequestDTO request) {
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
                unitFrom.getTeam(),
                unitFrom.getType(),
                unitFrom.isVisible(),
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

    private void processActionFightChooseUnit(String gameId, Team team, GameAction lastAction, GameActionFightChooseUnitRequestDTO request) {
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

        final var losingUnit = winningTeam == Team.RED ? blueType : redType;
        if (losingUnit == UnitType.FLAG) {
            finishGame(gameId, fightAction.getActionId(), winningTeam);
        }
    }

    private void finishGame(String gameId, long lastActionId, Team winningTeam) {
        final var action = new GameActionWin(gameId, lastActionId + 1, winningTeam);
        gameActionRepository.save(action);
        gameStateService.processAction(action);
    }

    private Team getOtherTeam(Team team) {
        return team == Team.RED ? Team.BLUE : Team.RED;
    }

    public FightResult fight(UnitType redType, UnitType blueType) {
        if (redType == blueType) {
            return FightResult.TIE;
        } else if (blueType == UnitType.FLAG || redType == UnitType.TRAP) {
            return FightResult.RED_WINS;
        } else if (blueType == UnitType.TRAP || blueType == UnitType.FLAG) {
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
