package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.UserProfileDTO;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // GET PROFILE
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(userService.getProfile(email));
    }

    // UPDATE PROFILE
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            Authentication auth,
            @RequestBody UserProfileDTO dto) {

        String email = auth.getName();
        return ResponseEntity.ok(userService.updateProfile(email, dto));
    }
}