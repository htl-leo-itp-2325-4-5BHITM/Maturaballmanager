package at.maturaballmanager.model;

import at.maturaballmanager.services.ValidationTool;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Person extends PanacheEntity implements Serializable {

    @Column(nullable = false, length = 30)
    public String firstName;

    @Column(nullable = false, length = 30)
    public String lastName;

    @Column(length = 50)
    public String email;

    @Column(length = 20)
    public String phoneNumber;

    public Person() {}

    @PrePersist
    @PreUpdate
    private void validate() {
        this.email = ValidationTool.validateEmail(email);
        this.phoneNumber = ValidationTool.validatePhoneNumber(phoneNumber);
    }
}