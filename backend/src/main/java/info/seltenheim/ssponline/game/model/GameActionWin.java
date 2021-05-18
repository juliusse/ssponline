package info.seltenheim.ssponline.game.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@DiscriminatorValue("WIN")
public class GameActionWin extends GameAction {
    @Column(name = "team")
    @Enumerated(EnumType.STRING)
    private Team team;

    public GameActionWin(String gameId, int actionId, Team winner) {
        super(gameId, actionId, GameActionType.WIN, null, GameState.ENDED);
        this.team = winner;
    }
}
