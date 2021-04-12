package info.seltenheim.ssponline.game.repository;

import info.seltenheim.ssponline.game.model.Point;
import info.seltenheim.ssponline.game.model.Team;
import info.seltenheim.ssponline.game.model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {
    // read
    List<Unit> findAllByGameId(String gameId);
    Optional<Unit> findByGameIdAndLocation(String gameId, Point location);

    // update
    @Modifying
    @Query("UPDATE info.seltenheim.ssponline.game.model.Unit u SET u.location = :newLocation WHERE u.id = :id")
    void updateUnitLocation(Long id, Point newLocation);

    // delete
    void deleteAllByGameIdAndTeam(String gameId, Team team);
}
