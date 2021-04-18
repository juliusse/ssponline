package info.seltenheim.ssponline.game.dto;

import info.seltenheim.ssponline.game.model.Fight;
import info.seltenheim.ssponline.game.model.GameState;
import info.seltenheim.ssponline.game.model.Point;
import info.seltenheim.ssponline.game.model.Team;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GameDTO {
    private String id;
    private Team activeTeam;
    private GameState gameState;
    private List<UnitDTO> units;
    private FightDTO fight;
}
