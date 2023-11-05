package at.maturaballmanager;

import at.maturaballmanager.model.Company;
import at.maturaballmanager.repo.DataManager;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/maturaballmanager/")
public class Router {

    @Inject
    DataManager dm;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/addCompany")
    public Response addCompany() {
        Company c = new Company();
        dm.save(c);
        return Response.ok().build();
    }

    @GET
    @Path("/getCompany/{id}")
    public Response getCompany(Long id) {
        Company c = dm.get(Company.class, id);
        return Response.ok(c).build();
    }
}