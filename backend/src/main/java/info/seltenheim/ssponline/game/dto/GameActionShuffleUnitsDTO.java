package info.seltenheim.ssponline.game.dto;

import info.seltenheim.ssponline.game.model.GameActionUnit;
import info.seltenheim.ssponline.game.model.Team;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameActionShuffleUnitsDTO extends GameActionDTO {
    private Team team;
    private List<GameActionUnitDTO> units;
}
