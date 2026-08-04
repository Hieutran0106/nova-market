package com.novamarket.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 50)
    private String brand;

    @Column(name = "model_name", nullable = false, length = 255)
    private String modelName;

    @Column(name = "price_vnd", nullable = false)
    private Long priceVnd;

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String specs;

    @Column(name = "key_features", columnDefinition = "text")
    private String keyFeatures;

    @Column(name = "in_stock")
    private Boolean inStock = true;

    @Column(name = "image_url", columnDefinition = "text")
    private String imageUrl;

    @Column(name = "inventory_status", length = 50)
    private String inventoryStatus;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "technical_specs", columnDefinition = "text")
    private String technicalSpecs;

    @Column(name = "service_packages", columnDefinition = "text")
    private String servicePackages;

    @Column(name = "promotions", columnDefinition = "text")
    private String promotions;

    @Column(name = "online_payment_offers", columnDefinition = "text")
    private String onlinePaymentOffers;
}
