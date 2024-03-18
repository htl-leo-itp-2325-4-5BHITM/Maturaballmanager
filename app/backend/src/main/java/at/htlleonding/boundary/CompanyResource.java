package at.htlleonding.boundary;

import at.htlleonding.model.dto.company.ContactPersonDTO;
import at.htlleonding.model.dto.company.CreateCompanyDTO;
import at.htlleonding.model.dto.company.UpdateCompanyDTO;
import at.htlleonding.repo.CompanyRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/companies")
public class CompanyResource {

    @Inject
    CompanyRepository companyRepository;

    @GET
    @Path("/overview")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCompanies() {
        return Response.ok(companyRepository.getCompanyOverview()).build();
    }

    @GET
    @Path("/detail/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCompanyDetail(@PathParam("id") Long id) {
        return Response.ok(companyRepository.getCompanyDetail(id)).build();
    }

    @POST
    @Transactional
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addCompany(CreateCompanyDTO dto) {
        try {
            companyRepository.add(dto);
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
        return Response.ok().build();
    }

    @DELETE
    @Transactional
    @Path("/delete/{id}")
    public Response deleteCompany(@PathParam("id") Long id) {
        try {
            companyRepository.delete(id);
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
        return Response.ok().build();
    }

    @POST
    @Transactional
    @Path("/update/{companyId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateCompany(UpdateCompanyDTO dto, @PathParam("companyId") Long companyId) {
        try {
            companyRepository.updateCompany(dto, companyId);
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
        return Response.ok().build();
    }

   /* @POST
    @Transactional
    @Path("/contactPerson/update/{contactPersonID}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateContactPerson(UpdateContactPersonDTO dto, @PathParam("contactPersonID") Long contactPersonID) {
        try {
            companyRepository.updateContactPerson(dto, contactPersonID);
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
        return Response.ok().build();
    }*/

    @DELETE
    @Transactional
    @Path("/contactPerson/update/{contactPersonID}")
    public Response updateContactPerson(ContactPersonDTO dto, @PathParam("contactPersonID") Long contactPersonID) {
        try {
            companyRepository.updateContactPerson(dto, contactPersonID);
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
        return Response.ok().build();
    }
}
