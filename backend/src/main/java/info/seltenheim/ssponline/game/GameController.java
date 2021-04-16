package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.dto.GameDTO;
import info.seltenheim.ssponline.game.dto.action.request.GameActionRequestDTO;
import info.seltenheim.ssponline.game.model.Team;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import java.util.stream.Collectors;

import static info.seltenheim.ssponline.game.dto.action.response.GameActionResponseDTOs.toGameActionDTO;

@RestController
@RequiredArgsConstructor
@Transactional(isolation = Isolation.READ_COMMITTED)
public class GameController {
    private final EntityManager entityManager;
    private final GameService gameService;

    @GetMapping("/game/{gameId}")
    public GameDTO getGame(@PathVariable String gameId,
                           @RequestParam("requestingPlayer") Team team,
                           @RequestParam(name = "fromIndex", defaultValue = "0") int fromIndex) {
        return toGameDTO(gameId, team, fromIndex);
    }

    @PostMapping("/game/{gameId}/action")
    public GameDTO getGame(@PathVariable String gameId,
                           @RequestParam("requestingPlayer") Team team,
                           @RequestParam(name = "fromIndex", defaultValue = "0") int fromIndex,
                           @RequestBody GameActionRequestDTO request) {

        gameService.processAction(gameId, team, request);
        return toGameDTO(gameId, team, fromIndex);
    }

    private GameDTO toGameDTO(String gameId, Team requestingTeam, int fromIndex) {
        final var game = gameService.getGame(gameId);
        final var gameActions = gameService.getGameActions(gameId, fromIndex);
        gameActions.forEach(entityManager::refresh);

        final var gameActionDTOs =
                gameActions
                        .stream()
                        .map(ga -> toGameActionDTO(ga, requestingTeam))
                        .collect(Collectors.toList());
        return new GameDTO(gameId, gameActionDTOs);
    }
}
