package info.seltenheim.ssponline.gamestate.model;

import info.seltenheim.ssponline.game.model.Team;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "game_state_game")
public class GameState {
    @Id
    @Column(name = "id")
    private String id;

    private long lastActionId;

    @Column(name = "active_team")
    @Enumerated(EnumType.ORDINAL)
    private Team activeTeam;

    @Column(name = "game_state")
    @Enumerated(EnumType.ORDINAL)
    private info.seltenheim.ssponline.game.model.GameState gameState;

    public GameState(String gameId) {
        this.id = gameId;
    }
}
