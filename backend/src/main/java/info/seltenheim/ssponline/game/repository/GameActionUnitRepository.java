package info.seltenheim.ssponline.game.repository;

import info.seltenheim.ssponline.game.model.GameActionUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameActionUnitRepository extends JpaRepository<GameActionUnit, Long> {

}
