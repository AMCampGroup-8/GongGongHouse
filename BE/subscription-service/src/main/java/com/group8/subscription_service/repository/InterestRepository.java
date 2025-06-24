package com.group8.subscription_service.repository;

import com.group8.subscription_service.domain.Interest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterestRepository extends JpaRepository<Interest, Long> {
    List<Interest> findByMemberId(Long memberId);
}
