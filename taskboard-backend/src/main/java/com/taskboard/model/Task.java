package com.taskboard.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter @Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String status;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference
    private Project project;

    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private User assignee;
}
