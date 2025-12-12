package com.taskboard.controller;

import com.taskboard.dto.AuthResponse;
import com.taskboard.dto.LoginRequest;
import com.taskboard.dto.RegisterRequest;
import com.taskboard.dto.UserDTO;
import com.taskboard.model.User;
import com.taskboard.repo.UserRepository;
import com.taskboard.security.JwtService;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepo,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest req) {

        if (userRepo.findByEmail(req.email()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Email already in use");
        }

        User user = new User();
        user.setEmail(req.email());
        user.setName(req.name());
        user.setPassword(passwordEncoder.encode(req.password()));

        userRepo.save(user);

        String token = jwtService.generateToken(user.getEmail());

        // Create UserDTO and return it with the token
        UserDTO userDto = new UserDTO();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setOwnedProjectIds(List.of());
        userDto.setAssignedTaskIds(List.of());

        return new AuthResponse(token, userDto);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        User user = userRepo.findByEmail(req.email())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());

        // Create UserDTO and return it with the token
        UserDTO userDto = new UserDTO();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setOwnedProjectIds(List.of());
        userDto.setAssignedTaskIds(List.of());

        return new AuthResponse(token, userDto);
    }
}
