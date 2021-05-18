package info.seltenheim.ssponline.game.model;

import info.seltenheim.ssponline.DbModel;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity(name = "game")
public class Game extends DbModel {
    @Id
    @Column(name = "id")
    private String id = UUID.randomUUID().toString();

    public Game(String id) {
        this.id = id;
    }
}
