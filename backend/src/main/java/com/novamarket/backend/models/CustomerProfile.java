package com.novamarket.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_profiles")
@Data
public class CustomerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", length = 100)
    private String userId;

    @Column(name = "extracted_budget")
    private Long extractedBudget;

    @Column(name = "extracted_room_size")
    private Integer extractedRoomSize;

    @Column(name = "preferences", columnDefinition = "jsonb")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    private String preferences;

    @Column(name = "loyalty_score")
    private Integer loyaltyScore;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
