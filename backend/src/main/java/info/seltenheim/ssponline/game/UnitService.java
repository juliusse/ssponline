package info.seltenheim.ssponline.game;

import info.seltenheim.ssponline.game.model.Point;
import info.seltenheim.ssponline.game.model.Team;
import info.seltenheim.ssponline.game.model.Unit;
import info.seltenheim.ssponline.game.model.UnitType;
import info.seltenheim.ssponline.game.repository.UnitRepository;
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

    public FightResult fight(Unit attacker, Unit defender) {
        final var attackerType = attacker.getType();
        final var defenderType = defender.getType();

        Unit winner;
        if(attackerType == defenderType) {
            unitRepository.delete(attacker);
            unitRepository.delete(defender);
            return FightResult.TIE;
        } else if (defenderType == UnitType.FLAG) {
            winner = attacker;
        } else if (defenderType == UnitType.TRAP) {
            winner = defender;
        } else if ((attackerType == UnitType.ROCK && defenderType == UnitType.SCISSORS)
                || (attackerType == UnitType.SCISSORS && defenderType == UnitType.PAPER)
                || (attackerType == UnitType.PAPER && defenderType == UnitType.ROCK)) {
            winner = attacker;
        } else {
            winner = defender;
        }
        unitRepository.delete(winner == attacker ? defender : attacker);


        winner.setVisible(true);
        winner.setLocation(defender.getLocation());
        unitRepository.save(winner);
        return FightResult.WIN;
    }

    public void createUnitsForTeam(@NonNull String gameId, @NonNull Team team) {
        unitRepository.deleteAllByGameIdAndTeam(gameId, team);

        final var allowedFigures = new UnitType[]{UnitType.ROCK, UnitType.PAPER, UnitType.SCISSORS};

        final int startY = team == Team.RED ? 0 : 4;

        for (int y = 0; y < 2; y++) {
            for (int x = 0; x < 7; x++) {
                final var type = allowedFigures[(int) (Math.random() * 3)];

                final var unit = new Unit(gameId, team, type, new Point(x, y + startY), false);
                unitRepository.save(unit);
            }
        }
    }

    public enum FightResult {
        WIN, TIE
    }
}
