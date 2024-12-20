package info.seltenheim.ssponline.gamestate.repository;

import info.seltenheim.ssponline.game.model.Point;
import info.seltenheim.ssponline.game.model.Team;
import info.seltenheim.ssponline.gamestate.model.Unit;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {
  // read
  List<Unit> findAllByGameId(String gameId);

  Optional<Unit> findByGameIdAndLocation(String gameId, Point location);

  // update
  @Modifying
  @Query("UPDATE info.seltenheim.ssponline.gamestate.model.Unit u SET u.location = :newLocation WHERE u.id = :id")
  void updateUnitLocation(Long id, Point newLocation);

  @Modifying
  @Query("UPDATE info.seltenheim.ssponline.gamestate.model.Unit u " +
    "SET u.location = :to " +
    "WHERE u.gameId = :gameId " +
    "AND u.location = :from")
  void updateUnitLocation(String gameId, Point from, Point to);

  // delete
  void deleteAllByGameIdAndTeam(String gameId, Team team);

  void deleteByGameIdAndLocation(String gameId, Point location);
}
