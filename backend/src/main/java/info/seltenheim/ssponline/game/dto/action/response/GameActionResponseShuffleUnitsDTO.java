package info.seltenheim.ssponline.game.dto.action.response;

import info.seltenheim.ssponline.game.model.Team;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameActionResponseShuffleUnitsDTO extends GameActionResponseDTO {
    private Team team;
    private List<GameActionResponseUnitDTO> units;
}
