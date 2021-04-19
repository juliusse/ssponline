package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.dto.GameDTO;
import info.seltenheim.ssponline.game.dto.action.request.GameActionRequestDTO;
import info.seltenheim.ssponline.game.model.Team;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

import static info.seltenheim.ssponline.game.dto.action.response.GameActionResponseDTOs.toGameActionDTO;

@RestController
@RequiredArgsConstructor
public class GameController {
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

        final var gameActionDTOs =
                gameActions
                        .stream()
                        .map(ga -> toGameActionDTO(ga, requestingTeam))
                        .collect(Collectors.toList());
        return new GameDTO(gameId, gameActionDTOs);
    }
}
