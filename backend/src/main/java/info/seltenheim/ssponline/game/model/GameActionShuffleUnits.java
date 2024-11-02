package info.seltenheim.ssponline.game.model;

import jakarta.persistence.*;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@DiscriminatorValue("SHUFFLE_UNITS")
public class GameActionShuffleUnits extends GameAction {
  @Column(name = "team")
  @Enumerated(EnumType.STRING)
  private Team team;

  @OneToMany
  @JoinColumns({
    @JoinColumn(name = "game_id", referencedColumnName = "game_id"),
    @JoinColumn(name = "action_id", referencedColumnName = "action_id")
  })
  private List<GameActionUnit> units;

  public GameActionShuffleUnits(String gameId, int actionId, Team team) {
    super(gameId, actionId, GameActionType.SHUFFLE_UNITS, null, GameState.SETUP);
    this.team = team;
  }
}
