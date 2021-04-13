package info.seltenheim.ssponline.game.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity(name = "fight")
public class Fight {

    @Id
    @Column(name = "game_id")
    private String gameId;

    @Embedded
    @Column(name = "location")
    private Point location;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "red_choice")
    private UnitType redChoice;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "blue_choice")
    private UnitType blueChoice;

    public Fight(String gameId, Point location) {
        this.gameId = gameId;
        this.location = location;
    }
}
