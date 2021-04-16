package info.seltenheim.ssponline.game.dto.action.response;

import info.seltenheim.ssponline.game.model.Point;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GameActionResponseMoveDTO extends GameActionResponseDTO {
    private Point from;
    private Point to;
}
