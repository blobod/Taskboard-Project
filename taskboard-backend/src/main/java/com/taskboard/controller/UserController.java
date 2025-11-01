package com.taskboard.controller;

import com.taskboard.model.User;
import com.taskboard.repo.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository repo;
    public UserController(UserRepository repo){ this.repo = repo; }

    @GetMapping public List<User> all(){ return repo.findAll(); }

    @GetMapping("/{id}")
    public User get(@PathVariable Long id){ return repo.findById(id).orElseThrow(); }

    @PostMapping
    public User create(@RequestBody User u){ return repo.save(u); }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User u){
        User existing = repo.findById(id).orElseThrow();
        existing.setEmail(u.getEmail());
        existing.setName(u.getName());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){ repo.deleteById(id); }
}
