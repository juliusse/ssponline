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
public class GameActionFightChooseUnit extends GameAction {
    @Column(name = "team")
    @Enumerated(EnumType.ORDINAL)
    private Team team;

    @Column(name = "unit_type")
    @Enumerated(EnumType.ORDINAL)
    private UnitType type;

    public GameActionFightChooseUnit(String gameId, Long actionId, Team activeTeam, Team team, UnitType type) {
        super(gameId, actionId, GameActionType.FIGHT_CHOOSE_UNIT, activeTeam, GameState.FIGHT);
        this.team = team;
        this.type = type;
    }
}
