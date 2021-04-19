package info.seltenheim.ssponline.game.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class GameActionMove extends GameAction {
    @Column(name = "team")
    @Enumerated(EnumType.ORDINAL)
    private Team team;
    @Column(name = "unit_type")
    @Enumerated(EnumType.ORDINAL)
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

    public Point getFrom() {
        return new Point(fromX, fromY);
    }

    public Point getTo() {
        return new Point(toX, toY);
    }

    public GameActionMove(String gameId, Long actionId, Team newActiveTeam, GameState newGameState,
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
}
