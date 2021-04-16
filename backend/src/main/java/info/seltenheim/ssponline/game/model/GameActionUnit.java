package info.seltenheim.ssponline.game.model;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "game_action_unit")
@IdClass(GameActionUnit.IdClass.class)
public class GameActionUnit {

    @Id
    @ManyToOne
    @JoinColumn(name = "game_action_id", nullable = false)
    private GameAction gameActionId;

    @Id
    private int x;

    @Id
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

    @Data
    public static class IdClass implements Serializable {
        private String gameActionId;
        private int x;
        private int y;
    }
}
