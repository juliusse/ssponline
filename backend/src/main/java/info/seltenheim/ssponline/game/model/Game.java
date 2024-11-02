package info.seltenheim.ssponline.game.model;

import info.seltenheim.ssponline.DbModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

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
