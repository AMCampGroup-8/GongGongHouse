package com.group8.NotificationService.test;

import com.group8.NotificationService.event.consumer.message.likedtag.LikeTagEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test-kafka")
@RequiredArgsConstructor
public class KafkaTestController {

    private final KafkaTemplate<String, LikeTagEvent> kafkaTemplate;

    @PostMapping("/like-tag")
    public String sendLikeTagEvent(@RequestBody LikeTagEvent event) {
        try {
            kafkaTemplate.send("likedtag", event);
            return "Kafka event sent successfully.";
        } catch (Exception e) {
            return "Failed to send Kafka event: " + e.getMessage();
        }
    }
}
