package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.services.AuthService
import io.smallrye.mutiny.Uni
import jakarta.inject.Inject
import jakarta.json.JsonString
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.eclipse.microprofile.jwt.JsonWebToken

@Path("/auth")
class AuthResource @Inject constructor(private val authService: AuthService) {

    @Inject
    lateinit var jwt: JsonWebToken

    @ConfigProperty(name = "quarkus.oidc.client-id")
    lateinit var clientId: String

    @POST
    @Path("/login")
    fun login(credentials: LoginRequest): Uni<Response> {
        return if (credentials.username.isNullOrBlank() || credentials.password.isNullOrBlank()) {
            Uni.createFrom().item(Response.status(Response.Status.BAD_REQUEST).entity("Invalid credentials").build())
        } else {
            authService.authenticate(credentials.username!!, credentials.password!!)
                .onItem().transform { tokenResponse ->
                    if (tokenResponse != null) {
                        val accessToken = tokenResponse.access_token
                        val refreshToken = tokenResponse.refresh_token

                        Response.ok()
                            .header("Authorization", "Bearer $accessToken")
                            .entity(mapOf("access_token" to accessToken, "refresh_token" to refreshToken))
                            .build()
                    } else {
                        Response.status(Response.Status.UNAUTHORIZED).entity("Authentication failed").build()
                    }
                }
        }
    }

    @POST
    @Path("/refresh")
    fun refreshToken(request: RefreshTokenRequest): Uni<Response> {
        return authService.refreshToken(request.refreshToken.toString())
            .onItem().transform { tokenResponse ->
                if (tokenResponse != null) {
                    Response.ok(tokenResponse).build()
                } else {
                    Response.status(Response.Status.UNAUTHORIZED).entity("Invalid refresh token").build()
                }
            }
    }

    @GET
    @Path("/validate")
    fun validate(): Response {
        return if (jwt.expirationTime > System.currentTimeMillis() / 1000) {
            Response.ok().entity(true).build()
        } else {
            Response.status(Response.Status.UNAUTHORIZED).entity("Token is invalid").build()
        }
    }

    @POST
    @Path("/hasRoles")
    fun hasRoles(roles: List<String>): Response {
        return if (roles.any { getClientRoles().contains(it) }) {
            Response.ok().entity(mapOf("hasRoles" to true)).build()
        } else if(jwt.groups.isEmpty() && roles.isEmpty()) {
            Response.ok().entity(mapOf("hasRoles" to true)).build()
        } else {
            Response.status(Response.Status.FORBIDDEN).entity("User does not have required roles").build()
        }
    }

    private fun getClientRoles(): List<String> {
        val resourceAccess = jwt.getClaim<Map<String, Any>>("resource_access")
        val clientData = resourceAccess?.get(clientId) as? Map<String, Any> ?: return emptyList()

        val rolesObj = clientData["roles"]
        if (rolesObj is List<*>) {
            return rolesObj.mapNotNull {
                if (it is JsonString) {
                    it.string
                } else it as? String
            }
        }
        return emptyList()
    }
}

data class LoginRequest(var username: String? = null, var password: String? = null)
data class RefreshTokenRequest(var refreshToken: String? = null)