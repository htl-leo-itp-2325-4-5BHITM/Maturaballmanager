package at.htlleonding.maturaballmanager.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.smallrye.common.constraint.NotNull;
import jakarta.persistence.*;

@Entity
@SequenceGenerator(name = "seq_faq", sequenceName = "seq_faq", allocationSize = 1, initialValue = 1)
public class FAQItem {

    @GeneratedValue(generator = "seq_faq")
    @Id
    private Long id;

    @Column(length = 1024, nullable = false)
    private String question;

    @Column(length = 1024, nullable = false)
    private String answer;

    @JsonIgnore
    private int priority;

    public FAQItem() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }
}
