package info.seltenheim.ssponline.game.repository;

import info.seltenheim.ssponline.game.model.Team;
import info.seltenheim.ssponline.game.model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {
    List<Unit> findAllByGameId(String gameId);
    void deleteAllByGameIdAndTeam(String gameId, Team team);
}
