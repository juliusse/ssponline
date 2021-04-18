package info.seltenheim.ssponline.game.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class GameActionStart extends GameAction {
    public GameActionStart(String gameId, Long actionId, Team startingTeam) {
        super(gameId, actionId, GameActionType.START, startingTeam, GameState.TURN);
    }
}
