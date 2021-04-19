package info.seltenheim.ssponline.game.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "game_action")
@EntityListeners(AuditingEntityListener.class)
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class GameAction {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "game_id")
    private String gameId;

    @Column(name = "created_date")
    @CreatedDate
    private long createdDate;

    @Column(name = "action_id")
    private Long actionId;

    @Column(name = "action_type")
    @Enumerated(EnumType.ORDINAL)
    private GameActionType actionType;

    @Column(name = "active_team")
    @Enumerated(EnumType.ORDINAL)
    private Team activeTeam;

    @Column(name = "game_state")
    @Enumerated(EnumType.ORDINAL)
    private GameState gameState;

    public GameAction(String gameId, Long actionId, GameActionType actionType, Team activeTeam, GameState gameState) {
        this.id = gameId + "_" + actionId;
        this.gameId = gameId;
        this.actionId = actionId;
        this.actionType = actionType;
        this.activeTeam = activeTeam;
        this.gameState = gameState;
    }
}
