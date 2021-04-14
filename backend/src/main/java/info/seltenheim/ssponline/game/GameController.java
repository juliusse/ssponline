package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.dto.*;
import info.seltenheim.ssponline.game.model.*;
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

//    @PostMapping("/game/{gameId}/move")
//    public GameDTO moveUnit(@PathVariable String gameId,
//                            @RequestParam("requestingPlayer") Team team,
//                            @RequestBody MoveUnitRequestDTO request) {
//        gameService.moveUnit(gameId, request.getFrom(), request.getTo());
//
//        return toGameDTO(gameId, team);
//    }
//
//    @PostMapping("/game/{gameId}/fight/choose")
//    public GameDTO chooseUnitInFight(@PathVariable String gameId,
//                            @RequestParam("requestingPlayer") Team team,
//                            @RequestBody FightChoseUnitRequestDTO request) {
//
//        gameService.chooseUnitForFight(gameId, team, UnitType.valueOf(request.getUnitType().name()));
//
//        return toGameDTO(gameId, team);
//    }

    private GameDTO toGameDTO(String gameId, Team requestingTeam) {
        final var game = gameService.getGame(gameId);
        final var gameActions = gameService.getGameActions(gameId);
        gameActions.forEach(entityManager::refresh);


//        final var fight = game.getGameState() == GameState.FIGHT ? gameService.getFightForGame(gameId) : null;
//        units.forEach(entityManager::refresh);

        return new GameDTO(
                gameId,
                gameActions.stream().map(ga -> toGameActionDTO(ga, requestingTeam)).collect(Collectors.toList())
        );
    }

    private GameActionDTO toGameActionDTO(GameAction gameAction, Team requestingTeam) {
        GameActionDTO gameActionDTO = null;

        if (gameAction instanceof GameActionConfigure) {
            gameActionDTO = new GameActionConfigureDTO();
        }

        if (gameAction instanceof GameActionShuffleUnits) {
            final var unitDTOs = ((GameActionShuffleUnits) gameAction).getUnits()
                    .stream()
                    .map(unit -> {
                        final var isMyUnit = requestingTeam == unit.getTeam();
                        final var isUncovered = unit.isVisible();
                        final var unitType = isMyUnit || isUncovered ?
                                UnitTypeDTO.valueOf(unit.getType().name()) :
                                UnitTypeDTO.HIDDEN;
                        return new GameActionUnitDTO(unit.getTeam(), unitType, unit.getLocation(), unit.isVisible());
                    })
                    .collect(Collectors.toList());

            gameActionDTO = new GameActionShuffleUnitsDTO()
                    .setTeam(((GameActionShuffleUnits) gameAction).getTeam())
                    .setUnits(unitDTOs);
        }

        if (gameAction instanceof GameActionAcceptUnits) {
            gameActionDTO = new GameActionAcceptUnitsDTO()
                    .setTeam(((GameActionAcceptUnits) gameAction).getTeam());
        }

        if (gameAction instanceof GameActionStart) {
            gameActionDTO = new GameActionStartDTO();
        }

        return gameActionDTO
                .setGameId(gameAction.getGameId())
                .setActionId(gameAction.getActionId())
                .setActionType(gameAction.getActionType())
                .setActiveTeam(gameAction.getActiveTeam())
                .setGameState(gameAction.getGameState());
    }

    private FightDTO toFightDTO(Fight fight, Team requestingTeam) {
        if (fight == null) {
            return null;
        }

        final var unit = requestingTeam == Team.RED ? fight.getRedChoice() : fight.getBlueChoice();
        final var unitDto = unit != null ? UnitTypeDTO.valueOf(unit.name()) : null;

        return new FightDTO(fight.getLocation(), unitDto);
    }
}
