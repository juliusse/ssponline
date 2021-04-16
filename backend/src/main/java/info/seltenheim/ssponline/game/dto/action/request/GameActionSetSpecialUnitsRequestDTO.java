package info.seltenheim.ssponline.game.dto.action.request;

import info.seltenheim.ssponline.game.model.Point;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GameActionSetSpecialUnitsRequestDTO extends GameActionRequestDTO {
    private Point trap1;
    private Point trap2;
    private Point flag;

}
