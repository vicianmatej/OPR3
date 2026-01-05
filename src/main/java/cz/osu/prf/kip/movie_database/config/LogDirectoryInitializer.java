package cz.osu.prf.kip.favouriteLinks.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class LogDirectoryInitializer {

    private static final Logger logger = LoggerFactory.getLogger(LogDirectoryInitializer.class);
    
    @Value("${logging.directory:logs}")
    private String logDirectory;

    @Bean
    public CommandLineRunner createLogDirectory() {
        return args -> {
            try {
                Path logPath = Paths.get(logDirectory);
                if (!Files.exists(logPath)) {
                    logger.info("Vytvářím adresář pro logy: {}", logPath.toAbsolutePath());
                    Files.createDirectories(logPath);
                    logger.info("Adresář pro logy byl úspěšně vytvořen");
                } else {
                    logger.info("Adresář pro logy již existuje: {}", logPath.toAbsolutePath());
                }
            } catch (Exception e) {
                logger.error("Chyba při vytváření adresáře pro logy", e);
            }
        };
    }
}











