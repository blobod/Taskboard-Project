package com.taskboard.controller;

import com.taskboard.dto.TaskCreateDTO;
import com.taskboard.dto.TaskDTO;
import com.taskboard.model.Project;
import com.taskboard.model.Task;
import com.taskboard.model.User;
import com.taskboard.repo.ProjectRepository;
import com.taskboard.repo.TaskRepository;
import com.taskboard.repo.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository repo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;

    public TaskController(TaskRepository repo, ProjectRepository projectRepo, UserRepository userRepo) {
        this.repo = repo;
        this.projectRepo = projectRepo;
        this.userRepo = userRepo;
    }

    // GET all tasks
    @GetMapping
    public List<TaskDTO> all() {
        return repo.findAll().stream().map(this::toDTO).toList();
    }

    // GET single task
    @GetMapping("/{id}")
    public TaskDTO get(@PathVariable Long id) {
        return toDTO(repo.findById(id).orElseThrow());
    }

    // create task
    @PostMapping("/project/{projectId}")
    public TaskDTO create(@PathVariable Long projectId, @RequestBody TaskCreateDTO dto) {
        Project project = projectRepo.findById(projectId).orElseThrow();
        User assignee = getAuthUser();

        Task t = new Task();
        t.setTitle(dto.getTitle());
        t.setStatus(dto.getStatus());
        t.setProject(project);
        t.setAssignee(assignee);

        return toDTO(repo.save(t));
    }

    // update task
    @PutMapping("/{id}")
    public TaskDTO update(@PathVariable Long id, @RequestBody TaskCreateDTO dto) {
        Task t = repo.findById(id).orElseThrow();
        t.setTitle(dto.getTitle());
        t.setStatus(dto.getStatus());
        return toDTO(repo.save(t));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    private User getAuthUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email).orElseThrow();
    }

    // convert to response DTO
    private TaskDTO toDTO(Task t) {
        TaskDTO dto = new TaskDTO();
        dto.setId(t.getId());
        dto.setTitle(t.getTitle());
        dto.setStatus(t.getStatus());
        dto.setProjectId(t.getProject() != null ? t.getProject().getId() : null);
        dto.setAssigneeId(t.getAssignee() != null ? t.getAssignee().getId() : null);
        return dto;
    }
}
