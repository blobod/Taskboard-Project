package com.taskboard.dto;

public record AuthResponse(String token, UserDTO user) {}