package info.seltenheim.ssponline.game.dto;

import info.seltenheim.ssponline.game.dto.action.response.GameActionResponseDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GameDTO {
  private String id;
  private List<GameActionResponseDTO> gameActions;
}
