package com.taskboard.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter @Setter
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    @JsonBackReference
    private User owner;


    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Task> tasks;

}
