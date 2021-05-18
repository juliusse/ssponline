package info.seltenheim.ssponline.game.repository;

import info.seltenheim.ssponline.game.model.GameAction;
import info.seltenheim.ssponline.game.model.GameActionType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameActionRepository extends JpaRepository<GameAction, GameAction.IdClass> {

    GameAction findFirstByGameIdOrderByActionIdDesc(String gameId);

    List<GameAction> findAllByGameIdOrderByActionIdAsc(String gameId, Pageable pageable);

    GameAction findFirstByGameIdAndActionTypeOrderByActionIdDesc(String gameId, GameActionType actionType);
}
