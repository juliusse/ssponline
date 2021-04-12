package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.model.Game;
import info.seltenheim.ssponline.game.model.GameBoard;
import info.seltenheim.ssponline.game.model.GameState;
import info.seltenheim.ssponline.game.model.Team;
import info.seltenheim.ssponline.game.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameService {
    private final GameRepository gameRepository;

    public Game getGame(String id) {
        return gameRepository.findById(id)
                .orElseGet(() -> {
                            final var board = new GameBoard();
                            board.initBoard();
                            return gameRepository.save(new Game(id, Team.BLUE, GameState.SELECT_UNIT, board));
                        }
                );
    }


//    public Game createNewGame() {
//
//    }
}
