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
public class GameActionFight extends GameAction {

    @Column(name = "location_x")
    private int x;
    @Column(name = "location_y")
    private int y;

    @Column(name = "unit_type_red")
    @Enumerated(EnumType.ORDINAL)
    private UnitType redType;

    @Column(name = "unit_type_blue")
    @Enumerated(EnumType.ORDINAL)
    private UnitType blueType;

    @Column(name = "winning_team")
    @Enumerated(EnumType.ORDINAL)
    private Team winningTeam;

    public Point getLocation() {
        return new Point(x, y);
    }

    public GameActionFight(String gameId, Long actionId, Team newActiveTeam, GameState gameState,
                           Point location, UnitType redType, UnitType blueType, Team winningTeam) {
        super(gameId, actionId, GameActionType.FIGHT, newActiveTeam, gameState);
        this.x = location.getX();
        this.y = location.getY();
        this.redType = redType;
        this.blueType = blueType;
        this.winningTeam = winningTeam;
    }
}
