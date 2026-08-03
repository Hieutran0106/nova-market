package com.novamarket.backend.repositories;

import com.novamarket.backend.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, String> {
    
    Optional<Customer> findByEmail(String email);
    
    Optional<Customer> findByPhone(String phone);

    @Query("SELECT c FROM Customer c WHERE c.email = :identity OR c.phone = :identity")
    Optional<Customer> findByPhoneOrEmail(@Param("identity") String identity);
}
