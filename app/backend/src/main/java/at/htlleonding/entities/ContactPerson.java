package at.htlleonding.entities;

import jakarta.persistence.*;

@Entity
@SequenceGenerator(name = "contactPersonSeq", initialValue = 50, allocationSize = 1)
public class ContactPerson {

    @Id
    @GeneratedValue(generator = "contactPersonSeq")
    private Long id;

    private String firstName;

    private String lastName;

    private String mail;

    private char sex;

    private String position;

    public ContactPerson() {

    }

    public ContactPerson(String firstName, String lastName, String mail, String position, char sex) {
        this();
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setMail(mail);
        this.setPosition(position);
        this.setSex(sex);
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public ContactPerson setFirstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public char getSex() {
        return sex;
    }

    public ContactPerson setSex(char sex) {
        this.sex = sex;
        return this;
    }

    public String getLastName() {
        return lastName;
    }

    public ContactPerson setLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public String getMail() {
        return mail;
    }

    public String getPosition() {
        return position;
    }

    public ContactPerson setPosition(String position) {
        this.position = position;
        return this;
    }

    public ContactPerson setMail(String mail) {
        this.mail = mail;
        return this;
    }
}
