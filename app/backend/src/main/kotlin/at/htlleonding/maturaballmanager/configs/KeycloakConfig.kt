package at.htlleonding.maturaballmanager.config

import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Produces
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.KeycloakBuilder
import org.eclipse.microprofile.config.inject.ConfigProperty

@ApplicationScoped
class KeycloakConfig {

    @ConfigProperty(name = "quarkus.oidc.auth-server-url")
    lateinit var authServerUrl: String

    @ConfigProperty(name = "quarkus.oidc.realm")
    lateinit var realm: String

    @ConfigProperty(name = "quarkus.oidc.client-id")
    lateinit var clientId: String

    @ConfigProperty(name = "quarkus.oidc.credentials.secret")
    lateinit var clientSecret: String

    @Produces
    @ApplicationScoped
    fun keycloakClient(): Keycloak {
        return KeycloakBuilder.builder()
            .serverUrl(authServerUrl)
            .realm(realm)
            .grantType("client_credentials")
            .clientId(clientId)
            .clientSecret(clientSecret)
            .build()
    }
}