package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.model.Game;
import info.seltenheim.ssponline.game.model.GameState;
import info.seltenheim.ssponline.game.model.Point;
import info.seltenheim.ssponline.game.model.Team;
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
    private final UnitService unitService;

    public Game getGame(@NonNull String id) {
        return gameRepository
                .findById(id)
                .orElseGet(() -> createNewGame(id));
    }


    public Game createNewGame(@NonNull String id) {
        log.info("Creating new Game with id '{}'", id);
        final var game = gameRepository.save(new Game(id, Team.RED, GameState.SELECT_UNIT));
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
        unitService.fight(unitFrom, unitTo);
        toggleTeamsTurn(game);
        return game;
    }

    private void toggleTeamsTurn(Game game) {
        final var nextTeam = game.getActiveTeam() == Team.RED ? Team.BLUE : Team.RED;
        game.setActiveTeam(nextTeam);
        gameRepository.updateActiveTeam(game.getId(), nextTeam);
    }
}
