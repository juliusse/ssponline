package info.seltenheim.ssponline.game.dto.action.request;

import info.seltenheim.ssponline.game.model.Point;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GameActionMoveRequestDTO extends GameActionRequestDTO {
    private Point from;
    private Point to;
}
