package com.taskboard.controller;

import com.taskboard.dto.UserCreateDTO;
import com.taskboard.dto.UserDTO;
import com.taskboard.model.User;
import com.taskboard.repo.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserController(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    // get all users
    @GetMapping
    public List<UserDTO> all() {
        return repo.findAll().stream().map(this::toDTO).toList();
    }

    // get single use
    @GetMapping("/{id}")
    public UserDTO get(@PathVariable Long id) {
        return toDTO(repo.findById(id).orElseThrow());
    }

    // create new user
    @PostMapping
    public UserDTO create(@RequestBody UserCreateDTO dto) {
        User u = new User();
        u.setEmail(dto.getEmail());
        u.setName(dto.getName());
        u.setPassword(encoder.encode(dto.getPassword()));
        return toDTO(repo.save(u));
    }

    // update user profile
    @PutMapping("/{id}")
    public UserDTO update(@PathVariable Long id, @RequestBody UserCreateDTO dto) {
        User u = repo.findById(id).orElseThrow();
        u.setEmail(dto.getEmail());
        u.setName(dto.getName());
        u.setPassword(encoder.encode(dto.getPassword()));
        return toDTO(repo.save(u));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // convert
    private UserDTO toDTO(User u) {
        UserDTO dto = new UserDTO();
        dto.setId(u.getId());
        dto.setEmail(u.getEmail());
        dto.setName(u.getName());
        return dto;
    }
}
