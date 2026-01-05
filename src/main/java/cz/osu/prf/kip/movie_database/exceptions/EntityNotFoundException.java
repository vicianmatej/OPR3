package cz.osu.prf.kip.favouriteLinks.exceptions;

import lombok.Getter;

@Getter
public class EntityNotFoundException extends RuntimeException {
    private final Class<?> entityClass;
    private final String identifier;

    public EntityNotFoundException(Class<?> entityClass, String identifier) {
        super("Entity " + entityClass.getSimpleName() + " with identifier " + identifier + " not found.");
        this.entityClass = entityClass;
        this.identifier = identifier;
    }

    public EntityNotFoundException(Class<?> entityClass, int id) {
        this(entityClass, "id == " + id);
    }
}
