package at.htlleonding.maturaballmanager.services

import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.KeycloakBuilder
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.representations.idm.RoleRepresentation
import org.keycloak.representations.idm.UserRepresentation

@ApplicationScoped
class KeycloakAdminService {

    @ConfigProperty(name = "quarkus.oidc.auth-server-url")
    lateinit var serverUrl: String

    @ConfigProperty(name = "quarkus.oidc.realm")
    lateinit var adminRealm: String

    @ConfigProperty(name = "quarkus.oidc.client-id")
    lateinit var clientId: String

    @ConfigProperty(name = "quarkus.oidc.credentials.secret")
    lateinit var clientSecret: String


    private fun getKeycloakClient(): Keycloak {
        return KeycloakBuilder.builder()
            .serverUrl(serverUrl)
            .realm(adminRealm)
            .grantType("client_credentials")
            .clientId(clientId)
            .clientSecret(clientSecret)
            .build()
    }

    /**
     * Weist einem Benutzer Rollen zu, die nicht mit "default-" beginnen.
     */
    fun assignRolesToUser(keycloakId: String, roles: List<String>): Uni<Void> {
        return Uni.createFrom().item {
            val keycloak = getKeycloakClient()
            val realm: RealmResource = keycloak.realm(adminRealm)
            val userResource = realm.users().get(keycloakId)
            val rolesResource = userResource.roles().realmLevel()

            // Filtere Rollen, die nicht mit "default-" beginnen
            val availableRoles: List<RoleRepresentation> = realm.roles().list().filter { !it.name.startsWith("default-") }

            val rolesToAssign = availableRoles.filter { roles.contains(it.name) }

            rolesResource.add(rolesToAssign)
            keycloak.close()
        }.replaceWithVoid()
    }

    /**
     * Entfernt Rollen von einem Benutzer, die nicht mit "default-" beginnen.
     */
    fun unassignRolesFromUser(keycloakId: String, roles: List<String>): Uni<Void> {
        return Uni.createFrom().item {
            val keycloak = getKeycloakClient()
            val realm: RealmResource = keycloak.realm(adminRealm)
            val userResource = realm.users().get(keycloakId)
            val rolesResource = userResource.roles().realmLevel()

            // Filtere Rollen, die nicht mit "default-" beginnen
            val availableRoles: List<RoleRepresentation> = realm.roles().list().filter { !it.name.startsWith("default-") }

            val rolesToUnassign = availableRoles.filter { roles.contains(it.name) }

            rolesResource.remove(rolesToUnassign)
            keycloak.close()
        }.replaceWithVoid()
    }

    /**
     * Holt die UserRepresentation eines Benutzers basierend auf der Keycloak-ID.
     */
    fun getUserRepresentation(keycloakId: String): Uni<UserRepresentation?> {
        return Uni.createFrom().item {
            val keycloak = getKeycloakClient()
            val realm: RealmResource = keycloak.realm(adminRealm)
            val user = realm.users().get(keycloakId).toRepresentation()
            keycloak.close()
            user
        }
    }

    /**
     * Sucht Benutzer basierend auf einem Suchbegriff.
     */
    fun searchUsers(query: String): Uni<List<UserRepresentation>> {
        return Uni.createFrom().item {
            val keycloak = getKeycloakClient()
            val realm: RealmResource = keycloak.realm(adminRealm)
            val users: List<UserRepresentation> = realm.users().search(query, 0, 50)
            keycloak.close()
            users
        }
    }

    /**
     * Get user by id
     */
    fun getUserById(userId: String): Uni<UserRepresentation?> {
        return Uni.createFrom().item {
            val keycloak = getKeycloakClient()
            val realm: RealmResource = keycloak.realm(adminRealm)
            val user = realm.users().get(userId).toRepresentation()
            keycloak.close()
            user
        }
    }
}