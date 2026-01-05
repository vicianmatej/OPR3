package cz.osu.prf.kip.favouriteLinks.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Aspect
public class ServiceLoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(ServiceLoggingAspect.class);

    @Before("execution(* cz.osu.prf.kip.favouriteLinks.services..*(..))")
    public void logBeforeService(JoinPoint joinPoint) {
        logger.info("Service method '{}.{}(...)' invoked with args: {}",
                joinPoint.getSignature().getDeclaringType().getSimpleName(),
                joinPoint.getSignature().getName(),
                joinPoint.getArgs());
    }

    @AfterReturning(pointcut = "execution(* cz.osu.prf.kip.favouriteLinks.services..*(..))", returning = "result")
    public void logAfterService(JoinPoint joinPoint, Object result) {
        String resultStr =
                result == null ? "(void)" :
                result instanceof List ? "List (#" + ((List<?>) result).size() + ")" :
                        result.getClass().isArray() ? "Array (# " + ((Object[]) result).length + ")" :
                                String.valueOf(result);
        logger.info("Service method '{}.{}(...)' result: {}",
                joinPoint.getSignature().getDeclaringType().getSimpleName(),
                joinPoint.getSignature().getName(),
                resultStr);
    }

    @AfterThrowing(pointcut = "execution(* cz.osu.prf.kip.favouriteLinks.services..*(..))", throwing = "ex")
    public void logException(JoinPoint joinPoint, Throwable ex) {
        logger.error("Service method '{}.{}(...)' error: {}. Args: {}",
                joinPoint.getSignature().getDeclaringType().getSimpleName(),
                joinPoint.getSignature().getName(),
                ex.getMessage(),
                joinPoint.getArgs(),
                ex);
    }
}
