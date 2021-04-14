package info.seltenheim.ssponline.game.dto;

import info.seltenheim.ssponline.game.model.Point;
import info.seltenheim.ssponline.game.model.Team;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameActionUnitDTO {
    private Team team;
    private UnitTypeDTO type;
    private Point location;

    private boolean isVisible;
}
