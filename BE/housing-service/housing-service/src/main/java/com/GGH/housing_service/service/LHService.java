package com.GGH.housing_service.service;

import com.GGH.housing_service.dto.LHNoticeItem;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LHService {
  private final RestTemplate restTemplate;

  private final String BASE_URL = "https://apis.data.go.kr/B552555/lhNoticeInfo1";
  private final String SERVICE_KEY = "🔑_여기에_인증키_붙여넣기_🔑";

  public List<LHNoticeItem> fetchNotices(LocalDate start, LocalDate end) {
    UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(BASE_URL)
        .queryParam("serviceKey", SERVICE_KEY)
        .queryParam("PG_SZ", "10")
        .queryParam("PAGE", "1")
        .queryParam("SCH_ST_DT", start)
        .queryParam("SCH_ED_DT", end);

    try {
      ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);
      ObjectMapper mapper = new ObjectMapper();
      JsonNode root = mapper.readTree(response.getBody());
      JsonNode dsSch = root.get(0).get("dsSch");
      return Arrays.asList(mapper.treeToValue(dsSch, LHNoticeItem[].class));
    } catch (Exception e) {
      e.printStackTrace();
      return Collections.emptyList();
    }
  }
}
