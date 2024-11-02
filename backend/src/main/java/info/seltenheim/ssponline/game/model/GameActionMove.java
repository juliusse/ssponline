package info.seltenheim.ssponline.game.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@DiscriminatorValue("MOVE")
public class GameActionMove extends GameAction {
  @Column(name = "team")
  @Enumerated(EnumType.STRING)
  private Team team;

  @Column(name = "unit_type")
  @Enumerated(EnumType.STRING)
  private UnitType type;

  @Column(name = "visible")
  private boolean visible;

  @Column(name = "from_x")
  private int fromX;

  @Column(name = "from_y")
  private int fromY;

  @Column(name = "to_x")
  private int toX;

  @Column(name = "to_y")
  private int toY;

  public GameActionMove(String gameId, int actionId, Team newActiveTeam, GameState newGameState,
                        Team team, UnitType unitType, boolean visible, Point from, Point to) {
    super(gameId, actionId, GameActionType.MOVE, newActiveTeam, newGameState);
    this.team = team;
    this.type = unitType;
    this.visible = visible;
    this.fromX = from.getX();
    this.fromY = from.getY();
    this.toX = to.getX();
    this.toY = to.getY();
  }

  public Point getFrom() {
    return new Point(fromX, fromY);
  }

  public Point getTo() {
    return new Point(toX, toY);
  }
}
