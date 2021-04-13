package info.seltenheim.ssponline.game.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity(name = "game")
public class Game {
    @Id
    @Column(name = "id")
    private String id = UUID.randomUUID().toString();

    @Column(name = "active_team")
    @Enumerated(EnumType.ORDINAL)
    private Team activeTeam;

    @Column(name = "game_state")
    @Enumerated(EnumType.ORDINAL)
    private GameState gameState;

    public Game(String id, Team activeTeam, GameState gameState) {
        this.id = id;
        this.activeTeam = activeTeam;
        this.gameState = gameState;
    }
}
