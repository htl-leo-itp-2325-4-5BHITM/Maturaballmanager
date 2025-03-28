package at.htlleonding.maturaballmanager.resources

import io.quarkus.security.Authenticated
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import org.eclipse.microprofile.jwt.JsonWebToken

@Path("/finance")
class FinanceResource {

    @Inject
    lateinit var jwt: JsonWebToken

    @GET
    @Path("/balance")
    fun getBalance(): Number {
        return 20
    }
}