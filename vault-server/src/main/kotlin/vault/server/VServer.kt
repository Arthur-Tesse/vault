package vault.server

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.beust.klaxon.JsonObject
import com.mongodb.MongoTimeoutException
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.auth.jwt.jwt
import io.ktor.features.*
import io.ktor.http.HttpStatusCode
import io.ktor.response.respond
import io.ktor.routing.routing
import io.ktor.server.cio.CIO
import io.ktor.server.engine.embeddedServer
import io.ktor.util.KtorExperimentalAPI
import org.slf4j.event.Level
import vault.server.route.api
import vault.server.route.assets
import vault.server.route.pages
import java.util.*

lateinit var configuration: Configuration
    private set

@KtorExperimentalAPI
fun main(args: Array<String>) {

    configuration = Configuration(*args)
    embeddedServer(factory = CIO,
                   port = configuration.vaultPort,
                   module = Application::vServer)
            .start(wait = true)
}

private fun Application.vServer() {

    install(Authentication) {

        jwt {

            realm = "Vault Administration"
            verifier(JWT.require(Algorithm.HMAC512(configuration.jwtSecret))
                             .withIssuer("vault-auth")
                             .acceptExpiresAt(3600)
                             .build())

            validate { credential ->

                if (credential.payload.issuer == "vault-auth")
                    Database.getUser(UUID.fromString(credential.payload.subject))
                else
                    null
            }
        }
    }
    install(AutoHeadResponse)
    install(CallLogging) {

        level = Level.INFO
    }
    install(Compression) {

        gzip()
    }
    install(ConditionalHeaders)
    install(DefaultHeaders)
    install(StatusPages) {

        exception<MongoTimeoutException> {

            call.respond(HttpStatusCode.BadRequest,
                         JsonObject().apply {
                             set("type",
                                 "EXCEPTION")
                             set("reason",
                                 "DB_CONNECTION_ERROR")
                         }.toJsonString())
        }
    }

    routing {

        api()
        pages()
        assets()
    }
}