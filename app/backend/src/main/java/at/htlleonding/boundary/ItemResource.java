package at.htlleonding.boundary;

import at.htlleonding.repo.ItemManager;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/items")
public class ItemResource {

    @Inject
    ItemManager im;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTemplateItems() {
        return Response.ok(im.getItemTemplates()).status(200).build();
    }
}
