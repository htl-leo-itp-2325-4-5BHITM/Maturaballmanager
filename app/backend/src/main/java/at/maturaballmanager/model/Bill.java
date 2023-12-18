package at.maturaballmanager.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.Set;

@Entity
public class Bill extends PanacheEntity {

    @ManyToOne
    @JoinTable(name = "FK_Items_Company")
    public Company company;

    @OneToMany
    @JoinTable(name = "FK_Item_Bills")
    public Set<Item> items;

    public Bill() {}
}