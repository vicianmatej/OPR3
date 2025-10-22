package cz.osu.prf.kip.favouriteLinks.model.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class FavouriteLink {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String urlAddress;

    @Column(nullable = true,columnDefinition = "NVARCHAR(1024)")
    private String label;
}
