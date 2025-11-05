package com.taskboard.controller;

import com.taskboard.dto.TaskDTO;
import com.taskboard.model.Project;
import com.taskboard.model.Task;
import com.taskboard.model.User;
import com.taskboard.repo.ProjectRepository;
import com.taskboard.repo.TaskRepository;
import com.taskboard.repo.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping
    public List<TaskDTO> all() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public TaskDTO get(@PathVariable Long id) {
        Task task = repo.findById(id).orElseThrow();
        return toDTO(task);
    }

    @PostMapping("/project/{projectId}/assign/{userId}")
    public TaskDTO createAndAssign(@PathVariable Long projectId, @PathVariable Long userId, @Valid @RequestBody TaskDTO dto) {
        Project project = projectRepo.findById(projectId).orElseThrow();
        User assignee = userRepo.findById(userId).orElseThrow();

        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setStatus(dto.getStatus());
        task.setProject(project);
        task.setAssignee(assignee);

        Task saved = repo.save(task);
        return toDTO(saved);
    }

    @PutMapping("/{id}")
    public TaskDTO update(@PathVariable Long id, @Valid @RequestBody TaskDTO dto) {
        Task existing = repo.findById(id).orElseThrow();
        existing.setTitle(dto.getTitle());
        existing.setStatus(dto.getStatus());
        Task updated = repo.save(existing);
        return toDTO(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    private TaskDTO toDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setStatus(task.getStatus());
        if (task.getProject() != null) dto.setProjectId(task.getProject().getId());
        if (task.getAssignee() != null) dto.setAssigneeId(task.getAssignee().getId());
        return dto;
    }
}
