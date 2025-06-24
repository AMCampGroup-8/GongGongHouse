package com.group8.NotificationService.event.consumer.message.community;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommunityEvent {
    public static final String Topic = "community";

    private String action;

    private String userId;

    private String postId;

    private String postTitle;

    private LocalDateTime eventTime;

}
