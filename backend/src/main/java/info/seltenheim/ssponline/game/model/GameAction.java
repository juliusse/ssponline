package info.seltenheim.ssponline.game.model;

import info.seltenheim.ssponline.DbModel;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "game_action")
@EntityListeners(AuditingEntityListener.class)
@IdClass(GameAction.IdClass.class)
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="action_type", discriminatorType = DiscriminatorType.STRING)
public class GameAction extends DbModel {
    @Id
    @Column(name = "game_id")
    private String gameId;

    @Id
    @Column(name = "action_id")
    private int actionId;

    @Column(name = "action_type", insertable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private GameActionType actionType;

    @Column(name = "active_team")
    @Enumerated(EnumType.STRING)
    private Team activeTeam;

    @Column(name = "game_state")
    @Enumerated(EnumType.STRING)
    private GameState gameState;

    public GameAction(String gameId, int actionId, GameActionType actionType, Team activeTeam, GameState gameState) {
        this.gameId = gameId;
        this.actionId = actionId;
        this.actionType = actionType;
        this.activeTeam = activeTeam;
        this.gameState = gameState;
    }

    @Data
    public static class IdClass implements Serializable {
        private String gameId;
        private int actionId;
    }
}
