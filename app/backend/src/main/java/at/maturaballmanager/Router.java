package at.maturaballmanager;

import at.maturaballmanager.model.Company;
import at.maturaballmanager.repo.DataManager;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/")
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

    @GET
    @Path("/getCompanyList")
    public Response getCompanyList() {
        return Response.ok(dm.getCompanyList()).build();
    }

    @DELETE
    @Path("/deleteCompany/{id}")
    public Response deleteCompany(@PathParam("id") Long id) {
        Company c = dm.get(Company.class, id);
        dm.delete(c);
        return Response.ok().status(200).build();
    }

    @DELETE
    @Path("/deleteCompany/{id}/{clazz}")
    public Response deleteCompany(@PathParam("id") Long id,@PathParam("clazz") String clazz) {
        dm.delete(clazz, id);
        return Response.ok().status(200).build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/updateCompany")
    public Response updateCompany(Company c) {
        dm.update(c);
        return Response.ok().build();
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Path("/uploadCompanies")
    public Response uploadCompanies() {
        return Response.ok().build();
    }
}