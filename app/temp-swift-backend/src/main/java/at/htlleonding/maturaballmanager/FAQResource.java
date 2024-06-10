package at.htlleonding.maturaballmanager;

import at.htlleonding.maturaballmanager.repository.FAQRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("faq")
public class FAQResource {

    @Inject
    FAQRepository repo;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response get() {
        return Response.ok().entity(repo.get()).build();
    }
}
