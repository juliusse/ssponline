package info.seltenheim.ssponline.game.dto.action.response;

import info.seltenheim.ssponline.game.model.Team;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameActionResponseShuffleUnitsDTO extends GameActionResponseDTO {
    private Team team;
    private List<GameActionResponseUnitDTO> units;
}
