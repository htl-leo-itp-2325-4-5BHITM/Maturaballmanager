package at.htlleonding.boundary;

import at.htlleonding.model.ContactPerson;
import at.htlleonding.model.dto.CompanyDTO;
import at.htlleonding.model.dto.ContactPersonDTO;
import at.htlleonding.repo.CompanyManager;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import javax.print.attribute.standard.Media;

@Path("/companies")
public class CompanyResource {

    @Inject
    CompanyManager cm;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCompanies() {
        try {
            return Response.ok(cm.getCompanies()).build();
        } catch (IllegalArgumentException exception) {
            return Response.ok().status(500).build();
        }
    }

    @POST
    @Path("/addCompany")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addCompany(CompanyDTO dto) {
        try {
            cm.addCompany(dto);
        } catch (IllegalArgumentException exception) {
            return Response.ok("E-1911").status(500).build();
        }
        return Response.ok().build();
    }

    @POST
    @Path("/deleteCompany")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteCompany(CompanyDTO dto) {
        try {
            cm.deleteCompany(dto);
        } catch (IllegalArgumentException exception) {
            return Response.ok("E-1912").status(500).build();
        }
        return Response.ok().build();
    }

    @POST
    @Path("/getCompanyBills")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCompanyBills(String companyName) {
        try {
            return Response.ok(cm.getCompanyBills(companyName)).status(200).build();
        } catch (IllegalArgumentException exception) {
            return Response.ok("E-1934").status(500).build();
        }
    }
}
