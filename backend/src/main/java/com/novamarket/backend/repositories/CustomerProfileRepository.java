package com.novamarket.backend.repositories;

import com.novamarket.backend.models.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Integer> {
    Optional<CustomerProfile> findByUserId(String userId);
}
