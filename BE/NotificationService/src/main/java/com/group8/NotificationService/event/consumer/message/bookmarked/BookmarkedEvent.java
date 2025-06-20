package com.group8.NotificationService.event.consumer.message.bookmarked;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class BookmarkedEvent {
    public static final String Topic = "bookmarked";

    private String action;

    private String userId;

    private String panId;

    private String update;

    private LocalDateTime eventTime;

}
