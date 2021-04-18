package info.seltenheim.ssponline.gamestate.repository;

import info.seltenheim.ssponline.game.model.Team;
import info.seltenheim.ssponline.gamestate.model.GameState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GameStateRepository extends JpaRepository<GameState, String> {
}
