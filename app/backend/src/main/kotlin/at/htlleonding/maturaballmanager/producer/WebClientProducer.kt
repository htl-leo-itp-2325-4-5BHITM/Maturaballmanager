import io.vertx.mutiny.core.Vertx
import io.vertx.mutiny.ext.web.client.WebClient
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.inject.Produces
import jakarta.inject.Inject

@ApplicationScoped
class WebClientProducer {

    @Inject
    lateinit var vertx: Vertx

    @Produces
    @ApplicationScoped
    fun createWebClient(): WebClient {
        return WebClient.create(vertx)
    }
}