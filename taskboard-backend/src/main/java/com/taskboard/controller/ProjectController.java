package com.taskboard.controller;

import com.taskboard.model.Project;
import com.taskboard.repo.ProjectRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectRepository repo;
    public ProjectController(ProjectRepository repo) { this.repo = repo; }

    @GetMapping public List<Project> all() { return repo.findAll(); }
    @PostMapping public Project create(@RequestBody Project p) { return repo.save(p); }
}
