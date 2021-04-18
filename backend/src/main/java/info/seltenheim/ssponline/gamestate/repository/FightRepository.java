package info.seltenheim.ssponline.gamestate.repository;

import info.seltenheim.ssponline.gamestate.model.Fight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FightRepository extends JpaRepository<Fight, String> {

}
