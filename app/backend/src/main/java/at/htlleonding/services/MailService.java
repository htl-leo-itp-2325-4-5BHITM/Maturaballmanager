package at.htlleonding.services;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import io.quarkus.qute.CheckedTemplate;
import io.quarkus.qute.TemplateInstance;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class MailService {

    @Inject
    Mailer mailer;

    @CheckedTemplate
    public static class Templates {
        public static native TemplateInstance billMail(String data);
    }

    public boolean sendActivationMail(String recipient, String dto) {
        var text = Templates.billMail(dto).render();
        mailer.send(Mail.withHtml(recipient, "HTL Leonding - Ihre Sponsoringrechnung", text));
        return true;
    }
}
