package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    // =====================
    // ADD PRODUCT
    // =====================
    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product,
                                        @RequestParam Long categoryId) {
        return ResponseEntity.ok(productService.addProduct(product, categoryId));
    }

    // =====================
    // UPDATE PRODUCT
    // =====================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                          @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    // =====================
    // DELETE PRODUCT
    // =====================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.deleteProduct(id));
    }

    // =====================
    // ADMIN VIEW ALL
    // =====================
    @GetMapping
    public List<Product> getAllProductsAdmin() {
        return productService.getAllProducts();
    }
}