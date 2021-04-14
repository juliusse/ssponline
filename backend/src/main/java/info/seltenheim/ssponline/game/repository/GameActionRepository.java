package info.seltenheim.ssponline.game.repository;

import info.seltenheim.ssponline.game.model.GameAction;

import info.seltenheim.ssponline.game.model.Game;
import info.seltenheim.ssponline.game.model.GameAction;
import info.seltenheim.ssponline.game.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameActionRepository extends JpaRepository<GameAction, String> {

    GameAction findFirstByGameIdOrderByActionIdDesc(String gameId);

    List<GameAction> findAllByGameIdOrderByActionIdAsc(String gameId);
}
