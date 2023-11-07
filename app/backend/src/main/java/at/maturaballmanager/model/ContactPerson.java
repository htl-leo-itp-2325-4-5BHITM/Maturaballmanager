package at.maturaballmanager.model;

import io.quarkus.devui.runtime.jsonrpc.JsonRpcResponse;
import jakarta.persistence.*;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestResponse;

import java.util.Optional;
import java.util.regex.Pattern;

@Entity
public class ContactPerson {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    private static final Pattern PHONE_PATTERN = Pattern.compile("^[0-9]{10}$");

    @SequenceGenerator(name = "contactPersonSeq", sequenceName = "CONTACTPERSON_SEQ", initialValue = 1, allocationSize = 1)
    @Id
    @GeneratedValue(generator = "contactPersonSeq")
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String email;

    private String phone;

    private String notes;

    public boolean setEmail(String email) {
        if ( !EMAIL_PATTERN.matcher(email).matches() && email.isEmpty()) {
            return false;
        } else this.email = email;
        return true;
    }

    public boolean setPhone(String phone) {
        if (!PHONE_PATTERN.matcher(phone).matches() && phone.isEmpty()) {
            this.phone = null;
            return false;
        } else this.phone = phone;
        return true;
    }

    public boolean setNotes(String notes) {
        this.notes = notes;
        return true;
    }

    public ContactPerson() {

    }
}