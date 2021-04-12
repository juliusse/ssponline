package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.dto.GameDTO;
import info.seltenheim.ssponline.game.dto.MoveUnitRequestDTO;
import info.seltenheim.ssponline.game.dto.UnitDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class GameController {
    private final EntityManager entityManager;
    private final GameService gameService;
    private final UnitService unitService;

    @GetMapping("/game/{gameId}")
    public GameDTO getGame(@PathVariable String gameId) {
        return toGameDTO(gameId);
    }

    @PostMapping("/game/{gameId}/move")
    public GameDTO moveUnit(@PathVariable String gameId, @RequestBody MoveUnitRequestDTO request) {
        gameService.moveUnit(gameId, request.getFrom(), request.getTo());

        return toGameDTO(gameId);
    }

    private GameDTO toGameDTO(String gameId) {
        final var game = gameService.getGame(gameId);
        final var units = unitService.getUnitsForGame(gameId);
        units.forEach(entityManager::refresh);
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
