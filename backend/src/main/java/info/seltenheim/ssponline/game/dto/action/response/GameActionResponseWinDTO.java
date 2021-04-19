package info.seltenheim.ssponline.game.dto.action.response;

import info.seltenheim.ssponline.game.model.Team;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GameActionResponseWinDTO extends GameActionResponseDTO {
    private Team team;
}
