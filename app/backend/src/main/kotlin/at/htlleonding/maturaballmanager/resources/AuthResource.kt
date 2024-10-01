package at.htlleonding.maturaballmanager.resources

import at.htlleonding.maturaballmanager.services.AuthService
import io.smallrye.mutiny.Uni
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.core.Response
import org.eclipse.microprofile.jwt.JsonWebToken

@Path("/auth")
class AuthResource @Inject constructor(private val authService: AuthService) {

    @Inject
    lateinit var jwt: JsonWebToken

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
}

data class LoginRequest(var username: String? = null, var password: String? = null)
data class RefreshTokenRequest(var refreshToken: String? = null)
