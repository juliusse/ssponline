package info.seltenheim.ssponline;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication
@EnableRetry
public class SsponlineBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SsponlineBackendApplication.class, args);
    }

}
