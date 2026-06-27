package com.example.demo.service;

import java.util.Objects;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.UserProfileDTO;
import com.example.demo.model.User;
import com.example.demo.model.User.Role;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.UserProfileDTO;
import org.springframework.security.core.Authentication;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // REGISTER USER / ADMIN
    // =========================
    public User register(User user, Role role) {

        if (user == null) {
            throw new RuntimeException("User cannot be null");
        }

        if (user.getEmail() == null || user.getPassword() == null) {
            throw new RuntimeException("Email and password are required");
        }

        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        // FORCE ROLE FROM BACKEND
        user.setRole(role);

        // ENCRYPT PASSWORD
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepo.save(user);
    }

    // =========================
    // LOGIN
    // =========================
    public User login(String email, String password) {

    if (email == null || email.trim().isEmpty() ||
        password == null || password.trim().isEmpty()) {
        throw new RuntimeException("Email and password required");
    }

    User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new RuntimeException("Invalid password");
    }

    return user;
}

    // =========================
    // GET USER BY ID
    // =========================
    public User getUserById(Long id) {

        Objects.requireNonNull(id, "User ID must not be null");

        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // =========================
    // DELETE USER
    // =========================
    public String deleteUser(Long id) {

        Objects.requireNonNull(id, "User ID must not be null");

        if (!userRepo.existsById(id)) {
            return "User not found";
        }

        userRepo.deleteById(id);
        return "User deleted successfully";
    }

    // =========================
    // PROFILE - GET
    // =========================
    public UserProfileDTO getProfile(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone()
        );
    }

    // =========================
    // PROFILE - UPDATE
    // =========================
    public UserProfileDTO updateProfile(String email, UserProfileDTO dto) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());
        user.setPhone(dto.getPhone());

        userRepo.save(user);

        return getProfile(email);
    }
}