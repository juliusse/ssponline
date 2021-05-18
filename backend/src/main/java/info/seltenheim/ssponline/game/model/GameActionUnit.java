package info.seltenheim.ssponline.game.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "game_action_unit")
public class GameActionUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "game_id")
    private String gameId;

    @Column(name = "action_id")
    private long actionId;

    @Column(name = "x")
    private int x;

    @Column(name = "y")
    private int y;

    @Column(name = "team")
    @Enumerated(EnumType.ORDINAL)
    private Team team;

    @Column(name = "type")
    @Enumerated(EnumType.ORDINAL)
    private UnitType type;

    @Column(name = "visible")
    private boolean isVisible;

    public Point getLocation() {
        return new Point(x, y);
    }

    public GameActionUnit(GameAction gameAction, int x, int y, Team team, UnitType type, boolean isVisible) {
        this.gameId = gameAction.getGameId();
        this.actionId = gameAction.getActionId();
        this.x = x;
        this.y = y;
        this.team = team;
        this.type = type;
        this.isVisible = isVisible;
    }
}
