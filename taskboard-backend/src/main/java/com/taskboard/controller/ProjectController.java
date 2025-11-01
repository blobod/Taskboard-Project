package com.taskboard.controller;

import com.taskboard.model.Project;
import com.taskboard.model.User;
import com.taskboard.repo.ProjectRepository;
import com.taskboard.repo.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectRepository repo;
    private final UserRepository userRepo;
    public ProjectController(ProjectRepository repo, UserRepository userRepo){ this.repo = repo;
        this.userRepo = userRepo;
    }

    @GetMapping public List<Project> all(){ return repo.findAll(); }

    @GetMapping("/{id}")
    public Project get(@PathVariable Long id){ return repo.findById(id).orElseThrow(); }

    @PostMapping
    public Project create(@RequestBody Project p){ return repo.save(p); }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id, @RequestBody Project p){
        Project existing = repo.findById(id).orElseThrow();
        existing.setName(p.getName());
        existing.setDescription(p.getDescription());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){ repo.deleteById(id); }

    @PostMapping("/{ownerId}")
    public Project create(@PathVariable Long ownerId, @RequestBody Project project) {
        User owner = userRepo.findById(ownerId).orElseThrow();
        project.setOwner(owner);
        return repo.save(project);
    }

}
