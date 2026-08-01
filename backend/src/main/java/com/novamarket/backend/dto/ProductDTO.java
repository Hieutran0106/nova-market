package com.novamarket.backend.dto;

import com.novamarket.backend.models.Product;
import lombok.Data;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

@Data
public class ProductDTO {
    private Integer id;
    private String name;
    private String slug;
    private String category;
    private String brand;
    private Long price;
    private Long oldPrice;
    private Integer discount;
    private Double rating;
    private Integer reviews;
    private Integer stock;
    private String image;
    private Boolean featured;
    private Boolean bestseller;
    private List<String> tags;
    private String shortDesc;
    private Map<String, Object> specs;

    public static ProductDTO fromEntity(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getBrand() + " " + product.getModelName());
        dto.setCategory(product.getCategory());
        dto.setBrand(product.getBrand());
        dto.setPrice(product.getPriceVnd());
        
        // Generate pseudo data for missing fields to keep frontend UI rich
        dto.setDiscount(15 + (product.getId() % 10)); // 15% - 24% discount
        dto.setOldPrice(product.getPriceVnd() + (product.getPriceVnd() * dto.getDiscount() / 100));
        
        // Slug generation
        dto.setSlug(dto.getName().toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-"));
        
        dto.setRating(4.0 + (product.getId() % 10) / 10.0);
        dto.setReviews(50 + (product.getId() * 7 % 200));
        dto.setStock(product.getInStock() ? 10 + (product.getId() % 50) : 0);
        
        // Assign default image based on category
        String img = "/assets/laptop.png";
        if (product.getCategory().equalsIgnoreCase("Tivi")) img = "/assets/tv.png";
        else if (product.getCategory().equalsIgnoreCase("Điện thoại")) img = "/assets/phone.png";
        else if (product.getCategory().equalsIgnoreCase("Máy giặt")) img = "/assets/washer.png";
        else if (product.getCategory().equalsIgnoreCase("Tủ lạnh")) img = "/assets/fridge.png";
        else if (product.getCategory().equalsIgnoreCase("Phụ kiện")) img = "/assets/earbuds.png";
        
        dto.setImage(img);
        dto.setFeatured(product.getId() % 3 == 0);
        dto.setBestseller(product.getId() % 4 == 0);
        dto.setTags(List.of(product.getCategory(), product.getBrand(), "Mới"));
        dto.setShortDesc(product.getKeyFeatures() != null ? product.getKeyFeatures() : "Sản phẩm chính hãng chất lượng cao.");
        
        // Parse specs JSONB string to Map
        if (product.getSpecs() != null && !product.getSpecs().isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                dto.setSpecs(mapper.readValue(product.getSpecs(), new TypeReference<Map<String, Object>>(){}));
            } catch (Exception e) {
                dto.setSpecs(new HashMap<>());
            }
        } else {
            dto.setSpecs(new HashMap<>());
        }
        
        return dto;
    }
}
