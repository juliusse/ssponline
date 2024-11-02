package info.seltenheim.ssponline.configuration;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class RequestExceptionMapper {

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException exception) {
    final var error = new ErrorResponse(400, exception.getMessage());
    return ResponseEntity.badRequest().body(error);
  }


  @Data
  @AllArgsConstructor
  public static class ErrorResponse {
    private int statusCode;
    private String message;
  }
}
