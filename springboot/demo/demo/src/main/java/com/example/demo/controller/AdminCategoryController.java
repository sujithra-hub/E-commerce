package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Category;
import com.example.demo.service.CategoryService;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final CategoryService categoryService;

    public AdminCategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // ================= ADD CATEGORY (ADMIN)
     @PostMapping
    public Category addCategory(
            @RequestBody Category category,
            @RequestHeader("Authorization") String token) {

        // Extract userId from JWT (IMPLEMENT in service/helper)
        Long userId = extractUserIdFromToken(token);

        category.setCreatedBy(userId);

        return categoryService.addCategory(category);
    }

    // ================= GET ALL CATEGORIES (ADMIN)
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // ================= UPDATE CATEGORY (ADMIN)
    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id,
                                   @RequestBody Category category) {
        category.setId(id);
        return categoryService.addCategory(category); 
        // or use a proper update method if you have one
    }

    // ================= DELETE CATEGORY (ADMIN)
    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return "Deleted successfully";
    }

    // ================= COUNT (ADMIN DASHBOARD)
    @GetMapping("/count")
    public long getTotalCategories() {
        return categoryService.getTotalCategories();
    }

    // ================= OPTIONAL: BY ADMIN
    @GetMapping("/admin/{adminId}")
    public List<Category> getCategoriesByAdmin(@PathVariable Long adminId) {
        return categoryService.getCategoriesByAdmin(adminId);
    }
     private Long extractUserIdFromToken(String token) {

        // remove Bearer prefix
        String jwt = token.replace("Bearer ", "");

        // 👉 CALL YOUR JWT SERVICE HERE
        // Example:
        // return jwtService.extractUserId(jwt);

        // TEMP fallback (replace this properly)
        return Long.parseLong("1");
    }
}