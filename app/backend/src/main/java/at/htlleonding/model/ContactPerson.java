package at.htlleonding.model;

import at.htlleonding.model.dto.CompanyDTO;
import at.htlleonding.model.dto.ContactPersonDTO;
import at.htlleonding.services.PatternStorage;
import jakarta.persistence.Embeddable;
import org.eclipse.microprofile.openapi.models.info.Contact;

import java.util.regex.Pattern;

@Embeddable
public class ContactPerson {

    private String firstName;
    private String lastName;
    private String mailAddress;
    private String phoneNumber;

    public ContactPerson() {

    }

    public ContactPerson(String firstName, String lastName) {
        this();
        this.setFirstName(firstName);
        this.setLastName(lastName);
    }

    public ContactPerson(String firstName, String lastName, String mailAddress, String phoneNumber) {
        this(firstName, lastName);
        this.setMailAddress(mailAddress);
        this.setPhoneNumber(phoneNumber);
    }

    public void edit(ContactPersonDTO dto) {
        this.setFirstName(dto.contactPerson().getFirstName());
        this.setLastName(dto.contactPerson().getLastName());
        this.setMailAddress(dto.contactPerson().getMailAddress());
        this.setPhoneNumber(dto.contactPerson().getPhoneNumber());
    }

    //<editor-fold desc="Getter & Setter">
    public String getFirstName() {
        return firstName;
    }

    public ContactPerson setFirstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public String getLastName() {
        return lastName;
    }

    public ContactPerson setLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public String getMailAddress() {
        return mailAddress;
    }

    public ContactPerson setMailAddress(String mailAddress) {
        if(Pattern.matches(PatternStorage.getMailAddressPattern().pattern(), mailAddress)) {
            this.mailAddress = mailAddress;
            return this;
        }
        throw new IllegalArgumentException("Mail address regex hurt (ContactPerson Setter)");
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public ContactPerson setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }
    //</editor-fold>
}
