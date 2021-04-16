package info.seltenheim.ssponline.gamestate;

import info.seltenheim.ssponline.game.model.GameActionUnit;
import info.seltenheim.ssponline.game.model.Point;
import info.seltenheim.ssponline.game.model.Team;
import info.seltenheim.ssponline.game.model.UnitType;
import info.seltenheim.ssponline.gamestate.model.Unit;
import info.seltenheim.ssponline.gamestate.repository.UnitRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UnitService {
    private final UnitRepository unitRepository;

    public List<Unit> getUnitsForGame(@NonNull String gameId) {
        return unitRepository.findAllByGameId(gameId);
    }

    public Optional<Unit> findUnitInLocation(@NonNull String gameId, @NonNull Point location) {
        return unitRepository.findByGameIdAndLocation(gameId, location);
    }

    public void updateUnitPosition(@NonNull Long id, @NonNull Point location) {
        unitRepository.updateUnitLocation(id, location);
    }

    public FightResult fightAfterMove(Unit attacker, Unit defender) {
        final var fightResult = fight(attacker.getType(), defender.getType());

        switch (fightResult) {
            case ATTACKER_WINS:
                unitRepository.delete(defender);
                attacker.setVisible(true);
                attacker.setLocation(defender.getLocation());
                unitRepository.save(attacker);
                break;
            case DEFENDER_WINS:
                unitRepository.delete(attacker);
                defender.setVisible(true);
                unitRepository.save(defender);
                break;
            case TIE:
                unitRepository.delete(attacker);
                unitRepository.delete(defender);
                break;
        }

        return fightResult;
    }

    public Unit creatNewUnit(@NonNull String gameId, Team team, UnitType type, Point location, boolean visible) {
        final var newUnit = new Unit(gameId, team, type, location, visible);
        return unitRepository.save(newUnit);
    }

    public FightResult fight(UnitType attackerType, UnitType defenderType) {
        if (attackerType == defenderType) {
            return FightResult.TIE;
        } else if (defenderType == UnitType.FLAG) {
            return FightResult.ATTACKER_WINS;
        } else if (defenderType == UnitType.TRAP) {
            return FightResult.DEFENDER_WINS;
        } else if ((attackerType == UnitType.ROCK && defenderType == UnitType.SCISSORS)
                || (attackerType == UnitType.SCISSORS && defenderType == UnitType.PAPER)
                || (attackerType == UnitType.PAPER && defenderType == UnitType.ROCK)) {
            return FightResult.ATTACKER_WINS;
        } else {
            return FightResult.DEFENDER_WINS;
        }
    }

    public void createUnitsForTeam(@NonNull String gameId, @NonNull Team team, List<GameActionUnit> units) {
        unitRepository.deleteAllByGameIdAndTeam(gameId, team);

        units.forEach(gameActionUnit -> {
            final var unit = new Unit(gameId, team, gameActionUnit.getType(), gameActionUnit.getLocation(), gameActionUnit.isVisible());
            unitRepository.save(unit);
        });
    }

    public void deleteUnitAtLocation(String gameId, Point location) {
        unitRepository.deleteByGameIdAndLocation(gameId, location);
    }

    public void replaceUnitAtPosition(String gameId, GameActionUnit newUnit) {
        deleteUnitAtLocation(gameId, newUnit.getLocation());

        final var unit = new Unit(gameId, newUnit.getTeam(), newUnit.getType(), newUnit.getLocation(), newUnit.isVisible());
        unitRepository.save(unit);
    }

    public void moveUnit(String gameId, Point from, Point to) {
        unitRepository.updateUnitLocation(gameId, from, to);
    }

    public enum FightResult {
        ATTACKER_WINS, DEFENDER_WINS, TIE
    }
}
