package com.tutorconnect.service;

import com.tutorconnect.model.Admin;
import com.tutorconnect.model.Student;
import com.tutorconnect.model.Tutor;
import com.tutorconnect.model.User;
import com.tutorconnect.repository.AdminRepository;
import com.tutorconnect.repository.StudentRepository;
import com.tutorconnect.repository.TutorRepository;
import com.tutorconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TutorRepository tutorRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    
    // ============ Generic User Methods ============
    
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    @Transactional
    public void updateLastLogin(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        });
    }
    
    @Transactional
    public void toggleUserActiveStatus(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setActive(!user.isActive());
            userRepository.save(user);
        });
    }
    
    // ============ Student Methods ============
    
    public List<Student> findAllStudents() {
        return studentRepository.findAll();
    }
    
    public Optional<Student> findStudentById(Long id) {
        return studentRepository.findById(id);
    }
    
    @Transactional
    public Student registerStudent(Student student) {
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        student.setRole(User.Role.STUDENT);
        return studentRepository.save(student);
    }
    
    @Transactional
    public Student updateStudent(Student student) {
        return studentRepository.save(student);
    }
    
    // ============ Tutor Methods ============
    
    public List<Tutor> findAllTutors() {
        return tutorRepository.findAll();
    }
    
    public List<Tutor> findTutorsBySubjectId(Long subjectId) {
        return tutorRepository.findBySubjectsId(subjectId);
    }
    
    public Optional<Tutor> findTutorById(Long id) {
        return tutorRepository.findById(id);
    }
    
    @Transactional
    public Tutor registerTutor(Tutor tutor) {
        tutor.setPassword(passwordEncoder.encode(tutor.getPassword()));
        tutor.setRole(User.Role.TUTOR);
        return tutorRepository.save(tutor);
    }
    
    @Transactional
    public Tutor updateTutor(Tutor tutor) {
        return tutorRepository.save(tutor);
    }
    
    // ============ Admin Methods ============
    
    public List<Admin> findAllAdmins() {
        return adminRepository.findAll();
    }
    
    public Optional<Admin> findAdminById(Long id) {
        return adminRepository.findById(id);
    }
    
    @Transactional
    public Admin registerAdmin(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRole(User.Role.ADMIN);
        return adminRepository.save(admin);
    }
    
    @Transactional
    public Admin updateAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
}