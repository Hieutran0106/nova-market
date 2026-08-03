package com.novamarket.backend.controllers;

import com.novamarket.backend.dto.AuthDTO;
import com.novamarket.backend.models.Customer;
import com.novamarket.backend.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDTO.RegisterRequest req) {
        if (req.getEmail() != null && !req.getEmail().isEmpty()) {
            if (customerRepository.findByEmail(req.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(new AuthDTO.AuthResponse("Email đã được sử dụng", null));
            }
        }
        
        if (req.getPhone() != null && !req.getPhone().isEmpty()) {
            if (customerRepository.findByPhone(req.getPhone()).isPresent()) {
                return ResponseEntity.badRequest().body(new AuthDTO.AuthResponse("Số điện thoại đã được sử dụng", null));
            }
        }

        Customer customer = new Customer();
        customer.setUserId(UUID.randomUUID().toString());
        customer.setFullName(req.getName());
        customer.setEmail(req.getEmail());
        customer.setPhone(req.getPhone());
        // For simplicity, we are storing password as plain text in this demo app. 
        // In production, MUST use BCryptPasswordEncoder.
        customer.setPassword(req.getPassword()); 

        customerRepository.save(customer);

        AuthDTO.AuthResponse.UserData userData = new AuthDTO.AuthResponse.UserData(customer.getFullName(), customer.getEmail(), customer.getPhone());
        return ResponseEntity.ok(new AuthDTO.AuthResponse("Đăng ký thành công", userData));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO.LoginRequest req) {
        Optional<Customer> optionalCustomer = customerRepository.findByPhoneOrEmail(req.getIdentity());

        if (optionalCustomer.isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthDTO.AuthResponse("Tài khoản không tồn tại", null));
        }

        Customer customer = optionalCustomer.get();
        if (!customer.getPassword().equals(req.getPassword())) {
            return ResponseEntity.badRequest().body(new AuthDTO.AuthResponse("Sai mật khẩu", null));
        }

        AuthDTO.AuthResponse.UserData userData = new AuthDTO.AuthResponse.UserData(customer.getFullName(), customer.getEmail(), customer.getPhone());
        return ResponseEntity.ok(new AuthDTO.AuthResponse("Đăng nhập thành công", userData));
    }
}
