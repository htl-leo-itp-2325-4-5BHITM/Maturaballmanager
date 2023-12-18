package at.maturaballmanager.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import java.io.Serializable;

@Entity
public class ContactPerson extends Person implements Serializable {

    @Column(length = 200)
    public String notes;
}
