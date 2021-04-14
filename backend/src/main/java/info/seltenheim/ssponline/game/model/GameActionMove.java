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

    public GameActionMove(String gameId, Long actionId, Team newactiveteam, Point from, Point to) {
        super(gameId, actionId, GameActionType.MOVE, newactiveteam, GameState.TURN);
        this.fromX = from.getX();
        this.fromY = from.getY();
        this.toX = to.getX();
        this.toY = to.getY();
    }
}
