package info.seltenheim.ssponline.mail;

import com.mailjet.client.MailjetClient;
import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.transactional.SendContact;
import com.mailjet.client.transactional.SendEmailsRequest;
import com.mailjet.client.transactional.TransactionalEmail;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MailService {
    private final MailConfig mailConfig;
    private final MailjetClient mailjetClient;

    public void sendGameStartEmail() {
        TransactionalEmail message = TransactionalEmail
                .builder()
                .to(new SendContact("NOT_SET", "some name"))
                .from(new SendContact(mailConfig.getFromEmailAddress(), "SSP Online"))
                .htmlPart("<h1>You were invited to a game of SSP Online</h1>")
                .subject("SSP Online - Game Invitation")
                .build();

        SendEmailsRequest request = SendEmailsRequest
                .builder()
                .message(message)
                .build();

        // act
        try {
            request.sendWith(mailjetClient);
        } catch (MailjetException e) {
            log.error("Could not send e-mail!", e);
        }
    }
}
