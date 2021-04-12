package info.seltenheim.ssponline.game.dto;

import info.seltenheim.ssponline.game.model.Point;
import info.seltenheim.ssponline.game.model.Team;
import info.seltenheim.ssponline.game.model.UnitType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnitDTO {
    private Team team;
    private UnitType type;
    private Point location;
}
