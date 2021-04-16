package info.seltenheim.ssponline.game.repository;

import info.seltenheim.ssponline.game.model.*;

import info.seltenheim.ssponline.game.model.GameAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameActionRepository extends JpaRepository<GameAction, String> {

    GameAction findFirstByGameIdOrderByActionIdDesc(String gameId);

    List<GameAction> findAllByGameIdOrderByActionIdAsc(String gameId);

    GameAction findFirstByGameIdAndActionTypeOrderByActionIdDesc(String gameId, GameActionType actionType);
}
