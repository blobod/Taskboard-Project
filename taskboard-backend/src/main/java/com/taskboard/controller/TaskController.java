package com.taskboard.controller;

import com.taskboard.model.Task;
import com.taskboard.repo.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository repo;
    public TaskController(TaskRepository repo) { this.repo = repo; }

    @GetMapping public List<Task> all() { return repo.findAll(); }
    @PostMapping public Task create(@RequestBody Task t) { return repo.save(t); }
}
