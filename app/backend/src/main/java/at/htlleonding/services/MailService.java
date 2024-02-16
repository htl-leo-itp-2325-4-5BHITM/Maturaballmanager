package at.htlleonding.services;

import at.htlleonding.entities.Invoice;
import at.htlleonding.model.dto.invoice.InvoiceDetailDTO;
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
        public static native TemplateInstance invoiceMail(InvoiceDetailDTO data);
    }

    public boolean sendInvoice(InvoiceDetailDTO dto) {
        var text = Templates.invoiceMail(dto).render();
        mailer.send(Mail.withHtml(dto.contactPerson().mail() == null ? dto.officeMail() : dto.contactPerson().mail(), "HTL Leonding - Ihre Sponsoringrechnung", text).addHeader("charset", "utf-8"));
        return true;
    }
}
