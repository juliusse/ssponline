package info.seltenheim.ssponline.game.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@DiscriminatorValue("FIGHT_CHOOSE_UNIT")
public class GameActionFightChooseUnit extends GameAction {
    @Column(name = "team")
    @Enumerated(EnumType.STRING)
    private Team team;

    @Column(name = "unit_type")
    @Enumerated(EnumType.STRING)
    private UnitType type;

    public GameActionFightChooseUnit(String gameId, int actionId, Team activeTeam, Team team, UnitType type) {
        super(gameId, actionId, GameActionType.FIGHT_CHOOSE_UNIT, activeTeam, GameState.FIGHT);
        this.team = team;
        this.type = type;
    }
}
