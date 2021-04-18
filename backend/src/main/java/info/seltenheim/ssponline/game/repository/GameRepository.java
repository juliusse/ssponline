package info.seltenheim.ssponline.game.repository;

import info.seltenheim.ssponline.game.model.Game;
import info.seltenheim.ssponline.game.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, String> {

    // update
    @Modifying
    @Query("UPDATE info.seltenheim.ssponline.game.model.Game g SET g.activeTeam = :team WHERE id = :gameId")
    void updateActiveTeam(String gameId, Team team);
}
