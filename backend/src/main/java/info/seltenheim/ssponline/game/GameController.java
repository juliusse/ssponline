package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.dto.GameDTO;
import info.seltenheim.ssponline.game.dto.UnitTypeDTO;
import info.seltenheim.ssponline.game.dto.action.request.GameActionRequestDTO;
import info.seltenheim.ssponline.game.dto.action.response.*;
import info.seltenheim.ssponline.game.model.*;
import info.seltenheim.ssponline.gamestate.UnitService;
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

    @PostMapping("/game/{gameId}/action")
    public GameDTO getGame(@PathVariable String gameId,
                           @RequestParam("requestingPlayer") Team team,
                           @RequestBody GameActionRequestDTO request) {

        gameService.processAction(gameId, team, request);
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

    private GameActionResponseDTO toGameActionDTO(GameAction gameAction, Team requestingTeam) {
        GameActionResponseDTO gameActionResponseDTO = null;

        if (gameAction instanceof GameActionConfigure) {
            gameActionResponseDTO = new GameActionResponseConfigureDTO();
        }

        if (gameAction instanceof GameActionShuffleUnits) {
            final var unitDTOs = ((GameActionShuffleUnits) gameAction).getUnits()
                    .stream()
                    .map(unit -> toUnitDTO(unit, requestingTeam))
                    .collect(Collectors.toList());

            gameActionResponseDTO = new GameActionResponseShuffleUnitsDTO()
                    .setTeam(((GameActionShuffleUnits) gameAction).getTeam())
                    .setUnits(unitDTOs);
        }

        if (gameAction instanceof GameActionAcceptUnits) {
            gameActionResponseDTO = new GameActionResponseAcceptUnitsDTO()
                    .setTeam(((GameActionAcceptUnits) gameAction).getTeam());
        }

        if (gameAction instanceof GameActionStart) {
            gameActionResponseDTO = new GameActionResponseStartDTO();
        }

        if (gameAction instanceof GameActionMove) {
            gameActionResponseDTO = new GameActionResponseMoveDTO()
                    .setFrom(((GameActionMove) gameAction).getFrom())
                    .setTo(((GameActionMove) gameAction).getTo());
        }

        if (gameAction instanceof GameActionFight) {
            final var fightAction = (GameActionFight) gameAction;
            gameActionResponseDTO = new GameActionResponseFightDTO()
                    .setLocation(fightAction.getLocation())
                    .setRedType(toUnitTypeDTO(fightAction.getRedType(), Team.RED, requestingTeam, true))
                    .setBlueType(toUnitTypeDTO(fightAction.getBlueType(), Team.BLUE, requestingTeam, true))
                    .setWinningTeam(fightAction.getWinningTeam());
        }

        return gameActionResponseDTO
                .setGameId(gameAction.getGameId())
                .setActionId(gameAction.getActionId())
                .setActionType(gameAction.getActionType())
                .setActiveTeam(gameAction.getActiveTeam())
                .setGameState(gameAction.getGameState());
    }

    private GameActionResponseUnitDTO toUnitDTO(GameActionUnit unit, Team requestingTeam) {
        final var unitType = toUnitTypeDTO(unit.getType(), unit.getTeam(), requestingTeam, unit.isVisible());
        return new GameActionResponseUnitDTO(unit.getTeam(), unitType, unit.getLocation(), unit.isVisible());
    }

    private UnitTypeDTO toUnitTypeDTO(UnitType unitType, Team unitTeam, Team requestingTeam, boolean isVisible) {
        final var isMyUnit = requestingTeam == unitTeam;
        return isMyUnit || isVisible ? UnitTypeDTO.valueOf(unitType.name()) : UnitTypeDTO.HIDDEN;
    }

//
//    private FightDTO toFightDTO(Fight fight, Team requestingTeam) {
//        if (fight == null) {
//            return null;
//        }
//
//        final var unit = requestingTeam == Team.RED ? fight.getRedChoice() : fight.getBlueChoice();
//        final var unitDto = unit != null ? UnitTypeDTO.valueOf(unit.name()) : null;
//
//        return new FightDTO(fight.getLocation(), unitDto);
//    }
}
