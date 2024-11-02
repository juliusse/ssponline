package info.seltenheim.ssponline.game.dto.action.response;

import info.seltenheim.ssponline.game.dto.UnitTypeDTO;
import info.seltenheim.ssponline.game.model.Team;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GameActionResponseFightChooseUnitDTO extends GameActionResponseDTO {
  private Team team;
  private UnitTypeDTO type;
}
