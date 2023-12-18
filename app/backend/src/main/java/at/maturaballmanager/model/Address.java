package at.maturaballmanager.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import java.io.Serializable;

@Entity
public class Address extends PanacheEntity implements Serializable {

    @Column(length = 20, nullable = false)
    public String street;

    @Column(length = 10, nullable = false)
    public String door;

    @Column(length = 3)
    public String stage;

    @Column(length = 8, nullable = false)
    public String zipCode;

    @Column(length = 30, nullable = false)
    public String town;

    @Column(length = 30, nullable = false)
    public String country;

    public Address() {}
}