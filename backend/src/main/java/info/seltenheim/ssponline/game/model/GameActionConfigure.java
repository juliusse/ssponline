package info.seltenheim.ssponline.game.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
