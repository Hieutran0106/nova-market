package com.novamarket.backend.controllers;

import com.novamarket.backend.dto.ProductDTO;
import com.novamarket.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<ProductDTO> getAllProducts(@org.springframework.web.bind.annotation.RequestParam(required = false) String category) {
        List<com.novamarket.backend.models.Product> products;
        if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("Tất cả")) {
            products = productRepository.findByCategoryIgnoreCase(category);
        } else {
            products = productRepository.findAll();
        }
        
        return products.stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
