package at.htlleonding.maturaballmanager.contracts.oidc;

import at.htlleonding.maturaballmanager.model.keycloak.TokenResponse;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.annotation.ClientHeaderParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.Map;

@RegisterRestClient(configKey = "oidc-client")
public interface OidcClient {

    @POST
    @Path("/protocol/openid-connect/token")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    @ClientHeaderParam(name = "Content-Type", value = "application/x-www-form-urlencoded")
    TokenResponse getToken(@FormParam("grant_type") String grantType,
                           @FormParam("client_id") String clientId,
                           @FormParam("client_secret") String clientSecret,
                           @FormParam("username") String username,
                           @FormParam("password") String password,
                           @FormParam("scope") String scope);

    @GET
    @Path("/protocol/openid-connect/userinfo")
    @Produces(MediaType.APPLICATION_JSON)
    Map<String, Object> getUserInfo(@HeaderParam("Authorization") String authorization);

    @GET
    @Path("/protocol/openid-connect/userinfo")
    @Produces(MediaType.APPLICATION_JSON)
    Map<String, Object> getRoles(@HeaderParam("Authorization") String authorization);
}