package com.group8.NotificationService.event.consumer.message.likedtag;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class LikeTagEvent {
    public static final String Topic = "likedtag";

    private String action;

    private String userId;

    private String tagId;

    private LocalDateTime eventTime;

}
