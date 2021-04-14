package info.seltenheim.ssponline.game.dto;

import info.seltenheim.ssponline.game.model.Team;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameActionAcceptUnitsDTO extends GameActionDTO {
    private Team team;
}
