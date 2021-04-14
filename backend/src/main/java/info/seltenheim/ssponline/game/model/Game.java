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

    public Game(String id) {
        this.id = id;
    }
}
