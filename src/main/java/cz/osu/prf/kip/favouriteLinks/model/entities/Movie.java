package cz.osu.prf.kip.favouriteLinks.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "release_year")
    private Integer releaseYear;

    @Column(length = 50)
    private String genre;

    @Column(length = 100)
    private String director;

    @Column(name = "poster_url", length = 500)
    private String posterUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private AppUser user;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Rating> ratings;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Review> reviews;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Watchlist> watchlistItems;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}