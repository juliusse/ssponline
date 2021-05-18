package info.seltenheim.ssponline.game.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@DiscriminatorValue("FIGHT")
public class GameActionFight extends GameAction {

    @Column(name = "location_x")
    private int x;
    @Column(name = "location_y")
    private int y;

    @Column(name = "unit_type_red")
    @Enumerated(EnumType.STRING)
    private UnitType redType;

    @Column(name = "unit_type_blue")
    @Enumerated(EnumType.STRING)
    private UnitType blueType;

    @Column(name = "winning_team")
    @Enumerated(EnumType.STRING)
    private Team winningTeam;

    public Point getLocation() {
        return new Point(x, y);
    }

    public GameActionFight(String gameId, int actionId, Team newActiveTeam, GameState gameState,
                           Point location, UnitType redType, UnitType blueType, Team winningTeam) {
        super(gameId, actionId, GameActionType.FIGHT, newActiveTeam, gameState);
        this.x = location.getX();
        this.y = location.getY();
        this.redType = redType;
        this.blueType = blueType;
        this.winningTeam = winningTeam;
    }
}
