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
public class GameActionWin extends GameAction {
    @Column(name = "team")
    @Enumerated(EnumType.ORDINAL)
    private Team team;

    public GameActionWin(String gameId, Long actionId, Team winner) {
        super(gameId, actionId, GameActionType.WIN, null, GameState.ENDED);
        this.team = winner;
    }
}
