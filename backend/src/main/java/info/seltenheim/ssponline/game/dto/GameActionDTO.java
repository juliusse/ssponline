package info.seltenheim.ssponline.game.dto;

import info.seltenheim.ssponline.game.model.GameActionType;
import info.seltenheim.ssponline.game.model.GameState;
import info.seltenheim.ssponline.game.model.Team;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameActionDTO {
    private String gameId;
    private Long actionId;
    private GameActionType actionType;
    private Team activeTeam;
    private GameState gameState;
}
