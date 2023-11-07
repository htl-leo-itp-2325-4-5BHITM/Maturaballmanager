package at.maturaballmanager.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.regex.Pattern;

@Entity
public class Company implements Serializable {

    private static final Pattern WEBSITE_PATTERN = Pattern.compile("^(http|https)://(.+)$");

    @SequenceGenerator(name = "companySeq", sequenceName = "COMPANY_SEQ", initialValue = 1, allocationSize = 1)
    @Id
    @GeneratedValue(generator = "companySeq")
    private Long id;

    private String name;

    private String address;

    @OneToOne(cascade = CascadeType.ALL)
    private ContactPerson contactPerson;

    private String website;

    public Company() {

    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
