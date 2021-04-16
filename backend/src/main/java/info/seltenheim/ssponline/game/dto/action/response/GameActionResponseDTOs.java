package info.seltenheim.ssponline.game.dto.action.response;

import info.seltenheim.ssponline.game.dto.UnitTypeDTO;
import info.seltenheim.ssponline.game.model.*;

import java.util.stream.Collectors;

public class GameActionResponseDTOs {
    private GameActionResponseDTOs() { }

    public static GameActionResponseDTO toGameActionDTO(GameAction gameAction, Team requestingTeam) {
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

        if (gameAction instanceof GameActionFightChooseUnit) {
            final var chooseAction = (GameActionFightChooseUnit) gameAction;

            gameActionResponseDTO = new GameActionResponseFightChooseUnitDTO()
                    .setTeam(chooseAction.getTeam())
                    .setType(toUnitTypeDTO(chooseAction.getType(), chooseAction.getTeam(), requestingTeam, false));
        }

        return gameActionResponseDTO
                .setGameId(gameAction.getGameId())
                .setActionId(gameAction.getActionId())
                .setActionType(gameAction.getActionType())
                .setActiveTeam(gameAction.getActiveTeam())
                .setGameState(gameAction.getGameState());
    }

    private static GameActionResponseUnitDTO toUnitDTO(GameActionUnit unit, Team requestingTeam) {
        final var unitType = toUnitTypeDTO(unit.getType(), unit.getTeam(), requestingTeam, unit.isVisible());
        return new GameActionResponseUnitDTO(unit.getTeam(), unitType, unit.getLocation(), unit.isVisible());
    }

    private static UnitTypeDTO toUnitTypeDTO(UnitType unitType, Team unitTeam, Team requestingTeam, boolean isVisible) {
        final var isMyUnit = requestingTeam == unitTeam;
        return isMyUnit || isVisible ? UnitTypeDTO.valueOf(unitType.name()) : UnitTypeDTO.HIDDEN;
    }
}
