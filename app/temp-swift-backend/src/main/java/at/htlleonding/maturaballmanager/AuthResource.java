package at.htlleonding.maturaballmanager;

import at.htlleonding.maturaballmanager.contracts.oidc.OidcClient;
import at.htlleonding.maturaballmanager.model.keycloak.TokenResponse;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.util.Map;
import java.util.logging.Logger;

@Path("/auth")
public class AuthResource {

    private static final Logger LOGGER = Logger.getLogger(AuthResource.class.getName());

    @Inject
    @RestClient
    OidcClient oidcClient;

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        LOGGER.info("Attempting to get token for username: " + username);

        try {
            TokenResponse tokenResponse = oidcClient.getToken(
                    "password",
                    "maturaballmanager",
                    "C4bc62f5JmmJVMK1Iu6qTmHUdMm0eO8C",
                    username,
                    password,
                    "openid"
            );
            LOGGER.info("Token response: " + tokenResponse);
            return Response.ok(tokenResponse).build();
        } catch (Exception e) {
            LOGGER.severe("Error: " + e.getMessage());
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid credentials").build();
        }
    }

    @GET
    @Path("/userinfo")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserInfo(@HeaderParam("Authorization") String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Missing or invalid Authorization header").build();
        }

        String token = authorization.substring("Bearer".length()).trim();

        try {
            Map<String, Object> userInfo = oidcClient.getUserInfo(token);
            return Response.ok(userInfo).build();
        } catch (Exception e) {
            LOGGER.severe("Error fetching user info: " + e.getMessage());
            return Response.status(Response.Status.UNAUTHORIZED).entity("Failed to fetch user info").build();
        }
    }
}