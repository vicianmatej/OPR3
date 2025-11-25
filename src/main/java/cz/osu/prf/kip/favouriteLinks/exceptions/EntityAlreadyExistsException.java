package cz.osu.prf.kip.favouriteLinks.exceptions;

import lombok.Getter;

@Getter
public class EntityAlreadyExistsException extends RuntimeException {
    private final Class<?> entityClass;
    private final String identifier;

    public EntityAlreadyExistsException(Class<?> entityClass, String identifier) {
        super("Entity " + entityClass.getSimpleName() + " with identifier " + identifier + " already exists.");
        this.entityClass = entityClass;
        this.identifier = identifier;
    }
}
