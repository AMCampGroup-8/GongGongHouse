package com.group8.NotificationService.config.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import com.google.firebase.messaging.FirebaseMessaging;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.InputStream;
@Slf4j
@Configuration
public class FirebaseConfig {

    @Value("${firebase.key-path}")
    private String firebaseKeyPath;

    private boolean initialized = false;

    @PostConstruct
    public void initialiseFirebase() {
        try (InputStream serviceAccount = new ClassPathResource(firebaseKeyPath).getInputStream()) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                initialized = true;
                log.info("✅ Firebase initialization successful");
            }
        } catch (Exception e) {
            log.error("🔥 Firebase initialization failed", e);
        }
    }

    @Bean
    public FirebaseMessaging firebaseMessaging() {
        if (!initialized || FirebaseApp.getApps().isEmpty()) {
            throw new IllegalStateException("❌ FirebaseApp not initialized properly. Cannot create FirebaseMessaging bean.");
        }
        return FirebaseMessaging.getInstance();
    }
}