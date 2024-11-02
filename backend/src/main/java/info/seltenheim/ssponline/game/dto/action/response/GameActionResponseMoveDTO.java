package info.seltenheim.ssponline.game.dto.action.response;

import info.seltenheim.ssponline.game.dto.UnitTypeDTO;
import info.seltenheim.ssponline.game.model.Point;
import info.seltenheim.ssponline.game.model.Team;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GameActionResponseMoveDTO extends GameActionResponseDTO {
  private Team team;
  private UnitTypeDTO unitType;
  private Point from;
  private Point to;
}
