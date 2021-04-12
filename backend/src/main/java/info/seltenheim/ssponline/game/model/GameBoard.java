package info.seltenheim.ssponline.game.model;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.SneakyThrows;

import javax.persistence.AttributeConverter;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.IOException;
import java.nio.charset.StandardCharsets;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameBoard {
    @Column(name = "board")
    private Unit[] board;

    public void initBoard() {
        this.board = new Unit[6 * 7];
        generateTeam(Team.BLUE);
        generateTeam(Team.RED);
    }

    private void generateTeam(Team team) {
        final var allowedFigures = new UnitType[]{UnitType.ROCK, UnitType.PAPER, UnitType.SCISSOR};

        final int startY = team == Team.RED ? 0 : 4;

        for (int y = 0; y < 2; y++) {
            for (int x = 0; x < 7; x++) {
                final var position = startY * 7 + y * 7 + x;
                final var type = allowedFigures[(int) (Math.random() * 3)];

                board[position] = new Unit(team, type, false);
            }
        }
    }


    public static class GameBoardConverter implements AttributeConverter<GameBoard, String> {
        @Override
        @SneakyThrows
        public String convertToDatabaseColumn(GameBoard gameBoard) {
            final var value = new ObjectMapper().writeValueAsString(gameBoard.getBoard());
            return value;
        }

        @Override
        @SneakyThrows
        public GameBoard convertToEntityAttribute(String dbData) {
            final var board = new ObjectMapper().readValue(dbData.getBytes(StandardCharsets.UTF_8), Unit[].class);
            return new GameBoard(board);
        }
    }
}
