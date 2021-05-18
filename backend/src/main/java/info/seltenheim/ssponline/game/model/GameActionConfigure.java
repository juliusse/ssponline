package info.seltenheim.ssponline.game.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Getter
@Setter
@Entity
@NoArgsConstructor
@DiscriminatorValue("CONFIGURE")
public class GameActionConfigure extends GameAction {

    public GameActionConfigure(String gameId, int actionId) {
        super(gameId, actionId, GameActionType.CONFIGURE, null, GameState.SETUP);
    }
}
