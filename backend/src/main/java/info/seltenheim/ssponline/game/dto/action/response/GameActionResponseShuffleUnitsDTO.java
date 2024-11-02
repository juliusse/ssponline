package info.seltenheim.ssponline.game.dto.action.response;

import info.seltenheim.ssponline.game.model.Team;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameActionResponseShuffleUnitsDTO extends GameActionResponseDTO {
  private Team team;
  private List<GameActionResponseUnitDTO> units;
}
