package at.htlleonding.maturaballmanager.services

import io.vertx.mutiny.core.MultiMap
import io.vertx.mutiny.ext.web.client.WebClient
import io.vertx.mutiny.ext.web.codec.BodyCodec
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import org.eclipse.microprofile.config.inject.ConfigProperty
import io.smallrye.mutiny.Uni

@ApplicationScoped
class AuthService {

    @Inject
    lateinit var webClient: WebClient

    @ConfigProperty(name = "quarkus.oidc.auth-server-url")
    lateinit var authServerUrl: String

    @ConfigProperty(name = "quarkus.oidc.client-id")
    lateinit var clientId: String

    @ConfigProperty(name = "quarkus.oidc.credentials.secret")
    lateinit var clientSecret: String

    data class TokenResponse(
        val access_token: String?,
        val refresh_token: String?
    )

    fun authenticate(username: String, password: String): Uni<TokenResponse?> {
        val form = MultiMap.caseInsensitiveMultiMap()
        form.set("grant_type", "password")
        form.set("client_id", clientId)
        form.set("client_secret", clientSecret)
        form.set("username", username)
        form.set("password", password)
        form.set("scope", "openid")

        return webClient.postAbs("$authServerUrl/protocol/openid-connect/token")
            .putHeader("Content-Type", "application/x-www-form-urlencoded")
            .`as`(BodyCodec.jsonObject())
            .sendForm(form)
            .onItem().transform { response ->
                if (response.statusCode() == 200) {
                    val accessToken = response.body().getString("access_token")
                    val refreshToken = response.body().getString("refresh_token")

                    if (accessToken != null && refreshToken != null) {
                        TokenResponse(accessToken, refreshToken)
                    } else {
                        null
                    }
                } else {
                    null
                }
            }
            .onFailure().recoverWithNull()
    }

    fun refreshToken(refreshToken: String): Uni<TokenResponse?> {
        val form = MultiMap.caseInsensitiveMultiMap()
        form.set("grant_type", "refresh_token")
        form.set("client_id", clientId)
        form.set("client_secret", clientSecret)
        form.set("refresh_token", refreshToken)

        return webClient.postAbs("$authServerUrl/protocol/openid-connect/token")
            .putHeader("Content-Type", "application/x-www-form-urlencoded")
            .`as`(BodyCodec.jsonObject())
            .sendForm(form)
            .onItem().transform { response ->
                if (response.statusCode() == 200) {
                    val accessToken = response.body().getString("access_token")
                    val newRefreshToken = response.body().getString("refresh_token")
                    TokenResponse(access_token = accessToken, refresh_token = newRefreshToken)
                } else {
                    null
                }
            }
            .onFailure().recoverWithNull()
    }


}