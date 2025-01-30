package at.htlleonding.maturaballmanager.services

import io.smallrye.mutiny.Uni
import jakarta.enterprise.context.ApplicationScoped
import jakarta.ws.rs.NotFoundException
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.KeycloakBuilder
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.representations.idm.UserRepresentation

@ApplicationScoped
class KeycloakAdminService {

    @ConfigProperty(name = "quarkus.oidc.server-url")
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
            .clientSecret(clientSecret)
            .clientId(clientId)
            .build()
    }

    /**
     * Retrieve the internal Keycloak client UUID by the client name (clientId in Keycloak terms).
     */
    private fun getClientUUID(keycloak: Keycloak, clientName: String): String {
        val realm = keycloak.realm(adminRealm)
        val clients = realm.clients().findAll()
        val foundClient = clients.firstOrNull { it.clientId == clientName }
            ?: throw NotFoundException("Client '$clientName' not found in realm '$adminRealm'")
        return foundClient.id
    }

    /**
     * Assigns client-level roles to a user.
     */
    fun assignClientRolesToUser(keycloakId: String, roles: List<String>): Uni<Void> {
        return Uni.createFrom().item {
            val keycloak = getKeycloakClient()
            val realm = keycloak.realm(adminRealm)
            val userResource = realm.users().get(keycloakId)

            val clientUUID = getClientUUID(keycloak, clientId)
            val clientResource = realm.clients().get(clientUUID)

            val clientRoles = clientResource.roles().list()
            val rolesToAssign = clientRoles.filter { roles.contains(it.name) }

            if (rolesToAssign.isNotEmpty()) {
                userResource.roles().clientLevel(clientUUID).add(rolesToAssign)
            }

            keycloak.close()
        }.replaceWithVoid()
    }

    /**
     * Unassigns client-level roles from a user.
     */
    fun unassignClientRolesFromUser(keycloakId: String, roles: List<String>): Uni<Void> {
        return Uni.createFrom().item {
            val keycloak = getKeycloakClient()
            val realm = keycloak.realm(adminRealm)
            val userResource = realm.users().get(keycloakId)

            val clientUUID = getClientUUID(keycloak, clientId)
            val clientResource = realm.clients().get(clientUUID)

            val clientRoles = clientResource.roles().list()
            val rolesToUnassign = clientRoles.filter { roles.contains(it.name) }

            if (rolesToUnassign.isEmpty()) {
                keycloak.close()
                return@item
            }

            userResource.roles().clientLevel(clientUUID).remove(rolesToUnassign)
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

    fun getClientRolesForUser(keycloakId: String): Uni<List<String>> {
        return Uni.createFrom().item {
            val keycloak = getKeycloakClient()
            val realm = keycloak.realm(adminRealm)
            val userResource = realm.users().get(keycloakId)

            val clientUUID = getClientUUID(keycloak, clientId)
            val clientRoles = userResource.roles().clientLevel(clientUUID).listAll()

            keycloak.close()

            clientRoles.map { it.name }
        }
    }
}