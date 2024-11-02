package info.seltenheim.ssponline.game.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Point implements Serializable {
  private int x;
  private int y;

  public boolean equals(int x, int y) {
    return this.getX() == x && this.getY() == y;
  }
}
