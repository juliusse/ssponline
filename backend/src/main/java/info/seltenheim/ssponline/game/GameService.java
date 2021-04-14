package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.UnitService.FightResult;
import info.seltenheim.ssponline.game.model.*;
import info.seltenheim.ssponline.game.repository.FightRepository;
import info.seltenheim.ssponline.game.repository.GameRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Slf4j
@RequiredArgsConstructor
@Transactional
public class GameService {
    private final GameRepository gameRepository;
    private final FightRepository fightRepository;
    private final UnitService unitService;

    public Game getGame(@NonNull String id) {
        return gameRepository
                .findById(id)
                .orElseGet(() -> createNewGame(id));
    }


    public Game createNewGame(@NonNull String id) {
        log.info("Creating new Game with id '{}'", id);
        final var game = gameRepository.save(new Game(id, Team.RED, GameState.TURN));
        unitService.createUnitsForTeam(id, Team.RED);
        unitService.createUnitsForTeam(id, Team.BLUE);
        return game;
    }

    public Game moveUnit(@NonNull String gameId, @NonNull Point from, @NonNull Point to) {
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

        if (fightResult != FightResult.TIE) {
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
                    game.setGameState(GameState.TURN);
                    final var nextTeam = game.getActiveTeam() == Team.RED ? Team.BLUE : Team.RED;
                    game.setActiveTeam(nextTeam);
                    gameRepository.save(game);
                    break;
                case DEFENDER_WINS:
                    unitService.creatNewUnit(gameId, Team.BLUE, fight.getBlueChoice(), fight.getLocation(), true);
                    fightRepository.delete(fight);
                    game.setGameState(GameState.TURN);
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

    private void toggleTeamsTurn(Game game) {
        final var nextTeam = game.getActiveTeam() == Team.RED ? Team.BLUE : Team.RED;
        game.setActiveTeam(nextTeam);
        gameRepository.updateActiveTeam(game.getId(), nextTeam);
    }

    private void enterTieMode(Game game, Point location) {
        game.setGameState(GameState.FIGHT);
        fightRepository.save(new Fight(game.getId(), location));

        gameRepository.save(game);
    }
}
