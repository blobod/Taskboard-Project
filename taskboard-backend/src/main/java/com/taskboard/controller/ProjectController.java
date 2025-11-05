package com.taskboard.controller;

import com.taskboard.dto.ProjectDTO;
import com.taskboard.dto.TaskDTO;
import com.taskboard.model.Project;
import com.taskboard.model.Task;
import com.taskboard.model.User;
import com.taskboard.repo.ProjectRepository;
import com.taskboard.repo.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectRepository repo;
    private final UserRepository userRepo;

    public ProjectController(ProjectRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    // GET all projects as DTOs
    @GetMapping
    public List<ProjectDTO> all() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // GET single project
    @GetMapping("/{id}")
    public ProjectDTO get(@PathVariable Long id) {
        Project project = repo.findById(id).orElseThrow();
        return toDTO(project);
    }

    // CREATE project for a specific owner
    @PostMapping("/{ownerId}")
    public ProjectDTO create(@PathVariable Long ownerId, @Valid @RequestBody ProjectDTO dto) {
        User owner = userRepo.findById(ownerId).orElseThrow();
        Project project = new Project();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setOwner(owner);
        Project saved = repo.save(project);
        return toDTO(saved);
    }

    // UPDATE project
    @PutMapping("/{id}")
    public ProjectDTO update(@PathVariable Long id, @Valid @RequestBody ProjectDTO dto) {
        Project existing = repo.findById(id).orElseThrow();
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        Project updated = repo.save(existing);
        return toDTO(updated);
    }

    // DELETE project
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // Conversion Helpers
    private ProjectDTO toDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        if (project.getOwner() != null) dto.setOwnerId(project.getOwner().getId());
        if (project.getTasks() != null) {
            dto.setTasks(project.getTasks().stream().map(this::toTaskDTO).collect(Collectors.toList()));
        }
        return dto;
    }

    private TaskDTO toTaskDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setStatus(task.getStatus());
        if (task.getAssignee() != null) dto.setAssigneeId(task.getAssignee().getId());
        if (task.getProject() != null) dto.setProjectId(task.getProject().getId());
        return dto;
    }
}
