package info.seltenheim.ssponline.game.dto.action.request;

import info.seltenheim.ssponline.game.dto.UnitTypeDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GameActionFightChooseUnitRequestDTO extends GameActionRequestDTO {
    private UnitTypeDTO unitType;
}
