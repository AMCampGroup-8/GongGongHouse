// src/main/java/com/group8/communityservice/common/entity/BaseTimeEntity.java
package com.group8.communityservice.entity;

import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@Getter
@MappedSuperclass // JPA 엔티티들이 이 클래스를 상속할 때 필드도 컬럼으로 인식하게 함
@EntityListeners(AuditingEntityListener.class) // Auditing 기능 포함
public abstract class BaseTimeEntity {

    @CreatedDate // 엔티티가 생성될 때 시간이 자동 저장
    @Column(updatable = false) // 생성 시간은 업데이트되지 않음
    private LocalDateTime createdAt;

    @LastModifiedDate // 엔티티가 변경될 때 시간이 자동 저장
    private LocalDateTime updatedAt;
}
