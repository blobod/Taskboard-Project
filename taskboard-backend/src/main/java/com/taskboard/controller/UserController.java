package com.taskboard.controller;

import com.taskboard.dto.UserDTO;
import com.taskboard.model.User;
import com.taskboard.repo.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<UserDTO> all() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserDTO get(@PathVariable Long id) {
        User user = repo.findById(id).orElseThrow();
        return toDTO(user);
    }

    @PostMapping
    public UserDTO create(@Valid @RequestBody UserDTO dto) {
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        User saved = repo.save(user);
        return toDTO(saved);
    }

    @PutMapping("/{id}")
    public UserDTO update(@PathVariable Long id, @Valid @RequestBody UserDTO dto) {
        User existing = repo.findById(id).orElseThrow();
        existing.setEmail(dto.getEmail());
        existing.setName(dto.getName());
        User updated = repo.save(existing);
        return toDTO(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        return dto;
    }
}
