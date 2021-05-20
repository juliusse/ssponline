package info.seltenheim.ssponline.mail;

import com.mailjet.client.ClientOptions;
import com.mailjet.client.MailjetClient;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;

@Data
@Validated
@Configuration
@ConfigurationProperties(prefix = "ssponline.mail")
public class MailConfig {
    @NotNull
    private String mailjetApiKey;
    @NotNull
    private String mailjetApiSecret;
    @NotNull
    private String fromEmailAddress;

    @Bean
    public MailjetClient mailjetClient() {
        ClientOptions options = ClientOptions.builder()
                .apiKey(mailjetApiKey)
                .apiSecretKey(mailjetApiSecret)
                .build();

        return new MailjetClient(options);
    }
}
