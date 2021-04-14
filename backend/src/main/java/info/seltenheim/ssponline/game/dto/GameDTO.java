package info.seltenheim.ssponline.game.dto;

import info.seltenheim.ssponline.game.dto.action.response.GameActionResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GameDTO {
    private String id;
    private List<GameActionResponseDTO> gameActions;
}
