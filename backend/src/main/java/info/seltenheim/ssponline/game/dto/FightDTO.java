package info.seltenheim.ssponline.game.dto;

import info.seltenheim.ssponline.game.model.Point;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FightDTO {
    private Point location;
    private UnitTypeDTO choice;
}
