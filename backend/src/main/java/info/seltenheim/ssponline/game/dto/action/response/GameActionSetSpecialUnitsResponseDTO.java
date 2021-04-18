package info.seltenheim.ssponline.game.dto.action.response;

import info.seltenheim.ssponline.game.model.Point;
import info.seltenheim.ssponline.game.model.Team;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class GameActionSetSpecialUnitsResponseDTO extends GameActionResponseDTO {
    private Team team;
    private List<GameActionResponseUnitDTO> units;
}
