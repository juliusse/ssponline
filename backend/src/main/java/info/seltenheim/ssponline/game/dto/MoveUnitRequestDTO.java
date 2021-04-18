package info.seltenheim.ssponline.game.dto;

import info.seltenheim.ssponline.game.model.Point;
import lombok.Data;

@Data
public class MoveUnitRequestDTO {
    private Point from;
    private Point to;
}
