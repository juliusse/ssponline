package info.seltenheim.ssponline.game.dto.action.response;

import info.seltenheim.ssponline.game.model.GameActionType;
import info.seltenheim.ssponline.game.model.GameState;
import info.seltenheim.ssponline.game.model.Team;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameActionResponseDTO {
    private String gameId;
    private Long actionId;
    private GameActionType actionType;
    private Team activeTeam;
    private GameState gameState;
}
