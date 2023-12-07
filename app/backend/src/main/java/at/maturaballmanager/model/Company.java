package at.maturaballmanager.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.regex.Pattern;

@Entity
public class Company implements Serializable {

    private static final Pattern WEBSITE_PATTERN = Pattern.compile("^(http|https)://(.+)$");

    @SequenceGenerator(name = "companySeq", sequenceName = "COMPANY_SEQ", initialValue = 10, allocationSize = 1)
    @Id
    @GeneratedValue(generator = "companySeq")
    private Long id;

    @Column
    private String name;

    @Column
    private String address;

    @OneToOne(cascade = CascadeType.ALL)
    private ContactPerson contactPerson;

    @Column
    private String website;

    public Company() {

    }

    public Company(String name, String address, String website) {
        this.name = name;
        this.address = address;
        this.website = website;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getWebsite() {
        return website;
    }
}
