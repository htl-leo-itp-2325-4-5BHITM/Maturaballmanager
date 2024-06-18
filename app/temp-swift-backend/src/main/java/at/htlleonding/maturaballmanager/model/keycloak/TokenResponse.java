package at.htlleonding.maturaballmanager.model.keycloak;

public record TokenResponse(String access_token, int expiresIn, String tokenType, String scope) {
}
