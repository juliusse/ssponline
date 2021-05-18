package info.seltenheim.ssponline.game.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class GameActionShuffleUnits extends GameAction {
    @Column(name = "team")
    @Enumerated(EnumType.ORDINAL)
    private Team team;

    @OneToMany
    @JoinColumns({
            @JoinColumn(name = "game_id", referencedColumnName = "game_id"),
            @JoinColumn(name = "action_id", referencedColumnName = "action_id")
    })
    private List<GameActionUnit> units;

    public GameActionShuffleUnits(String gameId, Long actionId, Team team) {
        super(gameId, actionId, GameActionType.SHUFFLE_UNITS, null, GameState.SETUP);
        this.team = team;
    }
}
