package info.seltenheim.ssponline.gamestate.repository;

import info.seltenheim.ssponline.gamestate.model.GameState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameStateRepository extends JpaRepository<GameState, String> {
}
