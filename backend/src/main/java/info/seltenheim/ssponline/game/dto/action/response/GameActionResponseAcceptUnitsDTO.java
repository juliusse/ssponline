package info.seltenheim.ssponline.game.dto.action.response;

import info.seltenheim.ssponline.game.model.Team;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameActionResponseAcceptUnitsDTO extends GameActionResponseDTO {
    private Team team;
}
