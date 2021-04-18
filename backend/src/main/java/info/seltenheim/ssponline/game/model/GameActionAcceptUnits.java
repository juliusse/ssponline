package info.seltenheim.ssponline.game.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class GameActionAcceptUnits extends GameAction {
    @Column(name = "team")
    @Enumerated(EnumType.ORDINAL)
    private Team team;

    public GameActionAcceptUnits(String gameId, Long actionId, Team team) {
        super(gameId, actionId, GameActionType.ACCEPT_UNITS, null, GameState.SETUP);
        this.team = team;
    }
}
