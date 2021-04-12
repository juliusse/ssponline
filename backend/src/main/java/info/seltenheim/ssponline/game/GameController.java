package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.dto.GameDTO;
import info.seltenheim.ssponline.game.dto.UnitDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class GameController {
    private final GameService gameService;
    private final UnitService unitService;

    @GetMapping("/game/{id}")
    public GameDTO getGame(@PathVariable(name = "id") String id) {
        final var game = gameService.getGame(id);
        final var units = unitService.getUnitsForGame(id);
        return new GameDTO(
                game.getId(),
                game.getActiveTeam(),
                game.getGameState(),
                units.stream()
                        .map(unit -> new UnitDTO(unit.getTeam(), unit.getType(), unit.getLocation()))
                        .collect(Collectors.toList())
        );
    }
}
