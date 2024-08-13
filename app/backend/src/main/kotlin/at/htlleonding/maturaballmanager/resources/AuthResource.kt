package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.services.AuthService
import io.smallrye.mutiny.Uni
import jakarta.inject.Inject
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.core.Response

@Path("/api/auth")
class AuthResource @Inject constructor(private val authService: AuthService) {

    @POST
    @Path("/login")
    fun login(credentials: LoginRequest): Uni<Response> {
        println("Received credentials: $credentials")

        return if (credentials.username.isNullOrBlank() || credentials.password.isNullOrBlank()) {
            Uni.createFrom().item(Response.status(Response.Status.BAD_REQUEST).entity("Invalid credentials").build())
        } else {
            authService.authenticate(credentials.username!!, credentials.password!!)
                .onItem().transform { token ->
                    if (token != null) {
                        Response.ok().header("Authorization", "Bearer $token").entity(mapOf("token" to token)).build()
                    } else {
                        Response.status(Response.Status.UNAUTHORIZED).entity("Authentication failed").build()
                    }
                }
        }
    }
}

data class LoginRequest(var username: String? = null, var password: String? = null)
