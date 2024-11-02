package info.seltenheim.ssponline.game.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@DiscriminatorValue("ACCEPT_UNITS")
public class GameActionAcceptUnits extends GameAction {
  @Column(name = "team")
  @Enumerated(EnumType.STRING)
  private Team team;

  public GameActionAcceptUnits(String gameId, int actionId, Team team) {
    super(gameId, actionId, GameActionType.ACCEPT_UNITS, null, GameState.SETUP);
    this.team = team;
  }
}
