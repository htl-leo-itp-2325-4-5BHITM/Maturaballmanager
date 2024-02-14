package at.htlleonding.boundary;

import at.htlleonding.model.dto.CompanyDTO;
import at.htlleonding.model.dto.ContactPersonDTO;
import at.htlleonding.repo.CompanyManager;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/contactpersons")
public class ContactPersonResource {

    @Inject
    CompanyManager cm;

    @POST
    @Path("/getContactPerson")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getContactPerson(CompanyDTO dto) {
        try {
            return Response.ok(cm.getContactPerson(dto)).build();
        } catch (IllegalArgumentException exception) {
            return Response.ok().status(500).build();
        }
    }

    @POST
    @Path("/addContactPerson")
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addContactPerson(ContactPersonDTO dto) {
        try {
            cm.addContactPerson(dto);
            return Response.ok().build();
        } catch(IllegalArgumentException exception) {
            return Response.ok("E-1913").status(500).build();
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
            return Response.ok("E-1914").status(500).build();
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
            return Response.ok("E-1915").status(500).build();
        }
    }
}
