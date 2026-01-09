package com.taskboard.controller;

import com.taskboard.dto.ProjectCreateDTO;
import com.taskboard.dto.ProjectDTO;
import com.taskboard.model.Project;
import com.taskboard.model.Task;
import com.taskboard.model.User;
import com.taskboard.repo.ProjectRepository;
import com.taskboard.repo.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository repo;
    private final UserRepository userRepo;

    public ProjectController(ProjectRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    // get all projects
    @GetMapping
    public List<ProjectDTO> all() {
        User currentUser = getAuthUser();
        return repo.findByOwnerId(currentUser.getId())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // get single project
    @GetMapping("/{id}")
    public ProjectDTO get(@PathVariable Long id) {
        return toDTO(repo.findById(id).orElseThrow());
    }

    // create project and assign the user
    @PostMapping
    public ProjectDTO create(@RequestBody ProjectCreateDTO dto) {
        User owner = getAuthUser();

        Project p = new Project();
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        p.setOwner(owner);

        return toDTO(repo.save(p));
    }

    @PutMapping("/{id}")
    public ProjectDTO update(@PathVariable Long id, @RequestBody ProjectCreateDTO dto) {
        Project p = repo.findById(id).orElseThrow();
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        return toDTO(repo.save(p));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    private User getAuthUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow();
    }

    // convert project to dto
    private ProjectDTO toDTO(Project p) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setOwnerId(p.getOwner() != null ? p.getOwner().getId() : null);

        dto.setTaskIds(p.getTasks() != null ?
                p.getTasks().stream().map(Task::getId).toList() :
                List.of());
        return dto;
    }
}
