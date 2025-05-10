package com.tutorconnect.controller.auth;

import com.tutorconnect.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
             message = "Password must be at least 8 characters long and include at least one digit, one lowercase letter, one uppercase letter, and one special character")
    private String password;
    
    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number should be valid")
    private String phone;
    
    @NotBlank(message = "Role is required")
    private String role;
    
    // Student specific fields
    private String educationLevel;
    private Integer grade;
    private String school;
    
    // Tutor specific fields
    private String bio;
    private String title;
    private Double hourlyRate;
    private Integer yearsOfExperience;
    
    public User.Role getUserRole() {
        return User.Role.valueOf(role.toUpperCase());
    }
}