package info.seltenheim.ssponline.game.dto.action.request;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import info.seltenheim.ssponline.game.model.GameActionType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.EXISTING_PROPERTY,
        property = "actionType")
@JsonSubTypes({
        @JsonSubTypes.Type(value = GameActionMoveRequestDTO.class, name = "MOVE"),
        @JsonSubTypes.Type(value = GameActionFightChooseUnitRequestDTO.class, name = "FIGHT_CHOOSE_UNIT"),
})
public class GameActionRequestDTO {
    private GameActionType actionType;
}
