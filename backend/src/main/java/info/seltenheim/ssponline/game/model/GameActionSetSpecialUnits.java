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
@DiscriminatorValue("SET_SPECIAL_UNITS")
public class GameActionSetSpecialUnits extends GameAction {
    @Column(name = "team")
    @Enumerated(EnumType.STRING)
    private Team team;

    @OneToMany
    @JoinColumns({
            @JoinColumn(name = "game_id", referencedColumnName = "game_id"),
            @JoinColumn(name = "action_id", referencedColumnName = "action_id")
    })
    private List<GameActionUnit> units;

    public GameActionSetSpecialUnits(String gameId, int actionId, Team team) {
        super(gameId, actionId, GameActionType.SET_SPECIAL_UNITS, null, GameState.SETUP);
        this.team = team;
    }
}
