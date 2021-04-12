package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.model.Game;
import info.seltenheim.ssponline.game.model.GameBoard;
import info.seltenheim.ssponline.game.model.GameState;
import info.seltenheim.ssponline.game.model.Team;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping("/game/{id}")
    public Game getGame(@PathVariable(name = "id") String id) {

        return gameService.getGame(id);
    }
}
