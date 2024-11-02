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
@DiscriminatorValue("START")
public class GameActionStart extends GameAction {
  public GameActionStart(String gameId, int actionId, Team startingTeam) {
    super(gameId, actionId, GameActionType.START, startingTeam, GameState.TURN);
  }
}
