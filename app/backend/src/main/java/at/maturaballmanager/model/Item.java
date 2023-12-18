package at.maturaballmanager.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
public class Item extends PanacheEntity implements Serializable {

    @Column(length = 30, nullable = false)
    public String name;

    @Column(nullable = false)
    public String description;

    @Column(nullable = false)
    public double price;

    public Item() {}
}