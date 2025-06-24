package com.group8.communityservice.repository;

import com.group8.communityservice.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    /*Optional<Member> findByEmail(String email);
    Optional<Member> findByNickname(String nickname);*/
}
