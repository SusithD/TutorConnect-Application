package com.tutorconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TutorConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(TutorConnectApplication.class, args);
    }
}