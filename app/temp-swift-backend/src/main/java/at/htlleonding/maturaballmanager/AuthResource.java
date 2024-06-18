package at.htlleonding.maturaballmanager;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.logging.Logger;

@Path("/auth")
public class AuthResource {

    private static final Logger LOGGER = Logger.getLogger(AuthResource.class.getName());

    @Inject
    JsonWebToken jwt;

    @GET
    @RolesAllowed("Maturaballleiter")
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Hello, " + jwt.getName();
    }
}
