package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.model.Game;
import info.seltenheim.ssponline.game.model.GameState;
import info.seltenheim.ssponline.game.model.Team;
import info.seltenheim.ssponline.game.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Transactional
public class GameService {
    private final GameRepository gameRepository;
    private final UnitService unitService;

    public Game getGame(String id) {
        return gameRepository
                .findById(id)
                .orElseGet(() -> createNewGame(id));
    }


    public Game createNewGame(String id) {
        final var game = gameRepository.save(new Game(id, Team.RED, GameState.SELECT_UNIT));
        unitService.createUnitsForTeam(id, Team.RED);
        unitService.createUnitsForTeam(id, Team.BLUE);
        return game;
    }
}
