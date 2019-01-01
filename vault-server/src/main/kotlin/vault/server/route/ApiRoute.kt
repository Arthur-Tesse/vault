package vault.server.route

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.beust.klaxon.Klaxon
import io.ktor.application.call
import io.ktor.auth.authenticate
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.request.receiveStream
import io.ktor.request.receiveText
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.*
import io.ktor.util.date.toGMTDate
import io.ktor.util.date.toJvmDate
import org.mindrot.BCrypt
import vault.data.TaggedObject
import vault.server.Database
import vault.server.configuration
import java.time.ZonedDateTime
import java.util.*
import kotlin.NoSuchElementException


fun Route.api() =
        route("api") {

            route("auth") {

                authenticate {

                    get("test") {

                        call.respondText("OK")
                    }
                }

                post("by-username/{username}") {

                    val username = call.parameters["username"].run { this?.trim() }
                            ?: throw IllegalArgumentException("Null username isn't allowed")
                    val user = Database.getUser(username)
                    val goodPass = try {
                        BCrypt.checkpw(call.receiveText().takeIf { that ->
                            !that.contains("[\r|\n]".toRegex())
                        }
                                               ?: throw Exception("Password contains line break or carriage return"),
                                       user.password)
                    } catch (ex: Exception) {
                        ex.printStackTrace()
                        false
                    }
                    if (goodPass)
                        call.respond(HttpStatusCode.OK,
                                     JWT.create()
                                             .withIssuer("vault-auth")
                                             .withExpiresAt(ZonedDateTime.now().plusHours(1).toGMTDate().toJvmDate())
                                             .withSubject(user.uuid.toString())
                                             .sign(Algorithm.HMAC512(configuration.jwtSecret)))
                    else
                        call.respond(HttpStatusCode.Forbidden,
                                     "")
                }
            }

            route("object") {

                get("{uuid}") {

                    val uuid = UUID.fromString(call.parameters["uuid"]
                                                       ?: throw IllegalArgumentException("Null uuid isn't allowed"))
                    call.respondText(text = Database.getObject(uuid).toJsonString(),
                                     contentType = ContentType.Application.Json)
                }

                get("all") {

                    if (!call.request.queryParameters["query"].isNullOrBlank()) {

                        call.respondText(text = Database.searchObjects(query = call.request.queryParameters["query"]!!,
                                                                       offset = (call.request.queryParameters["offset"]
                                                                               ?: "0").toInt())
                                .toJsonString(),
                                         contentType = ContentType.Application.Json)
                    } else {

                        call.respondText(text = Database.getAllObjectsOfType(null).toJsonString(),
                                         contentType = ContentType.Application.Json)
                    }
                }

                get("latest") {

                    try {
                        val latestItems = Database.getLatestObjects()
                        call.respondText(text = latestItems.toJsonString(),
                                         contentType = ContentType.Application.Json)
                    } catch (ex: Exception) {
                        throw ex
                    }
                }

                authenticate {

                    put {

                        val receivedObject = Klaxon().parse<TaggedObject>(call.receiveStream())!!
                        Database.insertObject(receivedObject)
                        call.respondText(text = "",
                                         contentType = ContentType.Text.Plain,
                                         status = HttpStatusCode.Created)
                    }

                    patch("{uuid}") {

                        val uuid = UUID.fromString(call.parameters["uuid"]
                                                           ?: throw IllegalArgumentException("Null uuid isn't allowed"))
                        if (!Database.hasObject(uuid))
                            throw NoSuchElementException("Can't patch a non-existent element")

                        val patch = Klaxon().parse<TaggedObject>(call.receiveStream())!!
                        if (patch.uuid != uuid)
                            throw IllegalArgumentException("UUIDs don't match [uuid=$uuid, patch.uuid=${patch.uuid}]")
                        Database.updateObject(uuid,
                                              patch)
                    }
                }
            }
        }

fun Any.toJsonString() =
        Klaxon().toJsonString(this)