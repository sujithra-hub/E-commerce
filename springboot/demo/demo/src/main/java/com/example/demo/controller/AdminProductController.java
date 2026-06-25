package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import com.example.demo.service.CloudinaryService;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;
    private final CloudinaryService cloudinaryService;

    public AdminProductController(ProductService productService,
                                 CloudinaryService cloudinaryService) {
        this.productService = productService;
        this.cloudinaryService = cloudinaryService;
    }

    // =====================
    // ADD PRODUCT
    // =====================
    @PostMapping
    public ResponseEntity<?> addProduct(
            @RequestBody Product product,
            @RequestParam Long categoryId
    ) {
        return ResponseEntity.ok(
                productService.addProduct(product, categoryId)
        );
    }

    // =====================
    // UPDATE PRODUCT
    // =====================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product
    ) {
        return ResponseEntity.ok(
                productService.updateProduct(id, product)
        );
    }

    // =====================
    // DELETE PRODUCT
    // =====================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(
                productService.deleteProduct(id)
        );
    }

    // =====================
    // GET ALL PRODUCTS (ADMIN)
    // =====================
    @GetMapping
    public List<Product> getAllProductsAdmin() {
        return productService.getAllProducts();
    }

    // =====================
    // UPLOAD IMAGE (CLOUDINARY)
    // =====================
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        String imageUrl = cloudinaryService.uploadImage(file);
        return ResponseEntity.ok(imageUrl);
    }
}