package info.seltenheim.ssponline.gamestate.model;

import info.seltenheim.ssponline.DbModel;
import info.seltenheim.ssponline.game.model.Team;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "game_state_game")
public class GameState extends DbModel {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "last_action_id")
    private long lastActionId;

    @Column(name = "active_team")
    @Enumerated(EnumType.ORDINAL)
    private Team activeTeam;

    @Column(name = "game_state")
    @Enumerated(EnumType.ORDINAL)
    private info.seltenheim.ssponline.game.model.GameState gameState;

    @Column(name = "accepted_units_red")
    private boolean redAcceptedUnits;

    @Column(name = "accepted_units_blue")
    private boolean blueAcceptedUnits;

    @Column(name = "special_units_red")
    private boolean redSetSpecialUnits;

    @Column(name = "special_units_blue")
    private boolean blueSetSpecialUnits;

    public GameState(String gameId) {
        this.id = gameId;
    }
}
