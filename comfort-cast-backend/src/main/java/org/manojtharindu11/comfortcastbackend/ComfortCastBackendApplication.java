package org.manojtharindu11.comfortcastbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ComfortCastBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ComfortCastBackendApplication.class, args);
    }

}
