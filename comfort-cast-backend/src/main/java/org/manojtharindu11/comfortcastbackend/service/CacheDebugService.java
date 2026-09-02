package org.manojtharindu11.comfortcastbackend.service;

import lombok.RequiredArgsConstructor;
import org.manojtharindu11.comfortcastbackend.dto.CacheDebugDto;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CacheDebugService {

    private final CacheManager cacheManager;

    public CacheDebugDto getCacheStatus(String cacheName, String cacheKey) {
        boolean cacheHit = isCacheHit(cacheName, cacheKey);
        return new CacheDebugDto(cacheKey, cacheHit ? "HIT" : "MISS");
    }

    public boolean isCacheHit(String cacheName, String cacheKey) {
        Cache cache = cacheManager.getCache(cacheName);
        return cache != null && cache.get(cacheKey) != null;
    }
}