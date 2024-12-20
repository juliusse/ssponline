package info.seltenheim.ssponline.game.dto.action.request;

import info.seltenheim.ssponline.game.model.Point;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GameActionMoveRequestDTO extends GameActionRequestDTO {
  private Point from;
  private Point to;
}
