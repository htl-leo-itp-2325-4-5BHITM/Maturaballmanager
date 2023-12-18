package at.maturaballmanager.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.io.Serializable;

@Entity
@Table(name = "MBMUser")
public class User extends Person implements Serializable {

    @Column(nullable = false)
    private String password;

    private Role role;
}