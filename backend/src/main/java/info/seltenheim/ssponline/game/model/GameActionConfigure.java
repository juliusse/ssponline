package info.seltenheim.ssponline.game.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class GameActionConfigure extends GameAction{

    public GameActionConfigure(String gameId, Long actionId) {
        super(gameId, actionId, GameActionType.CONFIGURE, null, GameState.SETUP);
    }
}
