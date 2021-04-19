package info.seltenheim.ssponline;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableRetry
@EnableTransactionManagement
@EnableJpaRepositories
@EnableJpaAuditing
public class SsponlineBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SsponlineBackendApplication.class, args);
    }

}
