package at.htlleonding.boundary;

import at.htlleonding.model.dto.AddressDTO;
import at.htlleonding.model.dto.CompanyDTO;
import at.htlleonding.model.dto.ContactPersonDTO;
import at.htlleonding.repo.CompanyManager;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/addresses")
public class AddressResource {

    @Inject
    CompanyManager cm;

    @POST
    @Path("/getAddress")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAddress(CompanyDTO dto) {
        try {
            return Response.ok(cm.getAddress(dto)).build();
        } catch (IllegalArgumentException exception) {
            return Response.ok().status(500).build();
        }
    }

    @POST
    @Path("/addAddress")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addContactPerson(AddressDTO dto) {
        try {
            cm.addAddress(dto);
            return Response.ok().build();
        } catch(IllegalArgumentException exception) {
            return Response.ok("E-1916").status(500).build();
        }
    }

    @POST
    @Path("/deleteContactPerson")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteContactPerson(CompanyDTO dto) {
        try {
            cm.deleteContactPerson(dto);
            return Response.ok().build();
        } catch (IllegalArgumentException exception) {
            return Response.ok("E-1917").status(500).build();
        }
    }

    @POST
    @Path("/editContactPerson")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response editContactPerson(ContactPersonDTO dto) {
        try {
            cm.editContactPerson(dto);
            return Response.ok().build();
        } catch (IllegalArgumentException exception) {
            return Response.ok("E-1918").status(500).build();
        }
    }
}
