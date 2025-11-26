package com.taskboard.controller;

import com.taskboard.dto.AuthResponse;
import com.taskboard.dto.LoginRequest;
import com.taskboard.dto.RegisterRequest;
import com.taskboard.model.User;
import com.taskboard.repo.UserRepository;
import com.taskboard.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

    // register
    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest req) {

        if (userRepo.findByEmail(req.email()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setEmail(req.email());
        user.setName(req.name());
        user.setPassword(passwordEncoder.encode(req.password()));

        userRepo.save(user);

        // pass emailto generate token
        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token);
    }

    // login
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        User user = userRepo.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // pass email again for token
        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token);
    }
}
