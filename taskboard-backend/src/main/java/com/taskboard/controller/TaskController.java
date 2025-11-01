package com.taskboard.controller;

import com.taskboard.model.Project;
import com.taskboard.model.Task;
import com.taskboard.model.User;
import com.taskboard.repo.ProjectRepository;
import com.taskboard.repo.TaskRepository;
import com.taskboard.repo.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository repo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;
    public TaskController(TaskRepository repo, ProjectRepository projectRepo, UserRepository userRepo){ this.repo = repo;
        this.projectRepo = projectRepo;
        this.userRepo = userRepo;
    }

    @GetMapping public List<Task> all(){ return repo.findAll(); }

    @GetMapping("/{id}")
    public Task get(@PathVariable Long id){ return repo.findById(id).orElseThrow(); }

    @PostMapping
    public Task create(@RequestBody Task t){ return repo.save(t); }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task t){
        Task existing = repo.findById(id).orElseThrow();
        existing.setTitle(t.getTitle());
        existing.setStatus(t.getStatus());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){ repo.deleteById(id); }

    @PostMapping("/project/{projectId}/assign/{userId}")
    public Task createAndAssign(@PathVariable Long projectId, @PathVariable Long userId, @RequestBody Task task) {
        Project project = projectRepo.findById(projectId).orElseThrow();
        User assignee = userRepo.findById(userId).orElseThrow();
        task.setProject(project);
        task.setAssignee(assignee);
        return repo.save(task);
    }

}
