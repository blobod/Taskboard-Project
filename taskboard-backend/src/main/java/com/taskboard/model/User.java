package com.taskboard.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String name;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    @JsonIgnore            // prevent recursion
    private List<Project> ownedProjects;

    @OneToMany(mappedBy = "assignee")
    @JsonIgnore
    private List<Task> assignedTasks;

}
