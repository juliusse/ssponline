package info.seltenheim.ssponline.gamestate.model;

import info.seltenheim.ssponline.DbModel;
import info.seltenheim.ssponline.game.model.Point;
import info.seltenheim.ssponline.game.model.Team;
import info.seltenheim.ssponline.game.model.UnitType;
import jakarta.persistence.*;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "game_state_unit")
public class Unit extends DbModel implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "game_id")
  private String gameId;

  @Column(name = "team")
  @Enumerated(EnumType.STRING)
  private Team team;

  @Column(name = "type")
  @Enumerated(EnumType.STRING)
  private UnitType type;

  @Column(name = "location")
  @Embedded
  private Point location;

  @Column(name = "visible")
  private boolean isVisible;

  public Unit(String gameId, Team team, UnitType type, Point location, boolean isVisible) {
    this.gameId = gameId;
    this.team = team;
    this.type = type;
    this.location = location;
    this.isVisible = isVisible;
  }
}
