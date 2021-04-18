package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.dto.GameDTO;
import info.seltenheim.ssponline.game.dto.MoveUnitRequestDTO;
import info.seltenheim.ssponline.game.dto.UnitDTO;
import info.seltenheim.ssponline.game.dto.UnitTypeDTO;
import info.seltenheim.ssponline.game.model.Team;
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
    public GameDTO getGame(@PathVariable String gameId, @RequestParam("requestingPlayer") Team team) {
        return toGameDTO(gameId, team);
    }

    @PostMapping("/game/{gameId}/move")
    public GameDTO moveUnit(@PathVariable String gameId,
                            @RequestParam("requestingPlayer") Team team,
                            @RequestBody MoveUnitRequestDTO request) {
        gameService.moveUnit(gameId, request.getFrom(), request.getTo());

        return toGameDTO(gameId, team);
    }

    private GameDTO toGameDTO(String gameId, Team requestingTeam) {
        final var game = gameService.getGame(gameId);
        final var units = unitService.getUnitsForGame(gameId);
        units.forEach(entityManager::refresh);

        final var unitDTOs = units
                .stream()
                .map(unit -> {
                    final var isMyUnit = requestingTeam == unit.getTeam();
                    final var isUncovered = unit.isVisible();
                    final var unitType = isMyUnit || isUncovered ?
                            UnitTypeDTO.valueOf(unit.getType().name()) :
                            UnitTypeDTO.HIDDEN;
                    return new UnitDTO(unit.getTeam(), unitType, unit.getLocation());
                })
                .collect(Collectors.toList());
        return new GameDTO(
                game.getId(),
                game.getActiveTeam(),
                game.getGameState(),
                unitDTOs
        );
    }
}
