package at.htlleonding.boundary;

import at.htlleonding.repo.CompanyRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/companies")
public class CompanyResource {

    @Inject
    CompanyRepository companyRepository;

    @GET
    @Path("/getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCompanies() {
        return Response.ok(companyRepository.getCompanies()).build();
    }
}
